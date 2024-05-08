let CANVAS = null;
let BTN_PLUS = null;
let BTN_MINUS = null;
let WAIT_ANIMATION = null;
let RANDOM_POSITION = true;
let BOX_PLACING = {X:0 ,Y:0};
const LINE_INCREMENT = 1; //TODO: WE likely want to tune this up as some boxes are too large?

// TODO: Create object for this?
let TRIALS = [];
let current_trial_count = 0;
let current_box_size = 0;
let current_line_length = 0;

/**
 *
 * @param trials A list of trials = {promptBoxSize: IN_PX, promptLineLength: IN_PX, responseBoxSize: IN_PX}
 * @param canvas_html_id The CANVAS HTML element where the study will be drawn.
 * @param canvas_width The desired width of the canvas. Best practice is to use fullscreen, except when doings instructions!
 * @param canvas_height The desired height of the canvas.
 * @param button_plus_id The HTML element that, when clicked, the drawn line will INCREASE in length.
 * @param button_minus_id The HTML element that, when clicked, the drawn line will DECREASE in length.
 * @param wait_element_id This element will be shown between prompt and response.
 * @param random_response_positions Indicate if the response box should be drawn in random parts of the canvas (recommended == true).
 */
const setup_canvas = (trials, canvas_html_id, canvas_width, canvas_height, button_plus_id, button_minus_id,
                      wait_element_id, random_response_positions = true) => {
    TRIALS = trials;
    current_trial_count = 0;
    current_box_size = 0;
    current_line_length = 0;
    CANVAS = document.getElementById(canvas_html_id);
    CANVAS.width = canvas_width;
    CANVAS.height = canvas_height;
    BTN_MINUS = document.getElementById(button_minus_id);
    BTN_PLUS = document.getElementById(button_plus_id);
    WAIT_ANIMATION = document.getElementById(wait_element_id);
    RANDOM_POSITION = random_response_positions;

    // TODO: NEED TO REMOVE THESE LISTENERS!
    window.addEventListener("keydown", function (event) {
        if (event.code in ['ArrowUp', 'ArrowDown', 'Space']) {
            event.preventDefault();
        }
    }, false);
    document.onkeydown = function (event) {
        if (event.code === 'ArrowDown') {
            btn_plus_clicked();
        } else if (event.code === 'ArrowUp') {
            btn_minus_clicked();
        }
    }
    BTN_MINUS.addEventListener("mousedown", btn_minus_clicked);
    BTN_PLUS.addEventListener("mousedown", btn_plus_clicked);
}

const btn_plus_clicked = () => {
    let newLineLength = current_line_length + LINE_INCREMENT;
    if (newLineLength <= TRIALS[current_trial_count-1].responseBoxSize) {
        current_line_length = newLineLength;
        redraw_canvas(current_box_size, current_line_length);
    }
}

const btn_minus_clicked = () => {
    let newLineLength = current_line_length - LINE_INCREMENT;
    if (newLineLength >= 0) {
        current_line_length = newLineLength;
        redraw_canvas(current_box_size, current_line_length);
    }
}

const set_box_to_center = () => {
    BOX_PLACING.X = CANVAS.width/2;
    BOX_PLACING.Y = CANVAS.height/2;
}

const set_box_to_random = (box_size) => {
    let min_val = 0+box_size/2;
    let max_x = CANVAS.width-box_size/2;
    let max_y = CANVAS.height-box_size/2;
    BOX_PLACING.X = Math.floor(Math.random() * (max_x - min_val + 1) + min_val);
    BOX_PLACING.Y = Math.floor(Math.random() * (max_y - min_val + 1) + min_val);
}



const draw_trial_result = (finished_trial) => {
    const ctx = CANVAS.getContext("2d");
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
    let canvasCenter = CANVAS.width/2;
    let boxPromptCenter = canvasCenter/2;
    let boxPromptSize = finished_trial.promptBoxSize;
    let boxResponseCenter = canvasCenter+boxPromptCenter;
    let boxResponseSize = finished_trial.responseBoxSize;
    ctx.fillStyle = "black";
    //PROMPT
    ctx.strokeRect((boxPromptCenter-(boxPromptSize/2)), BOX_PLACING.Y, boxPromptSize, boxPromptSize);
    ctx.beginPath();
    ctx.moveTo(boxPromptCenter, BOX_PLACING.Y);
    ctx.lineTo(boxPromptCenter, BOX_PLACING.Y + finished_trial.promptLineLength);
    ctx.stroke();
    //RESPONSE
    ctx.strokeRect((boxResponseCenter-(boxResponseSize/2)), BOX_PLACING.Y, boxResponseSize, boxResponseSize);
    ctx.beginPath();
    ctx.moveTo(boxResponseCenter, BOX_PLACING.Y);
    ctx.lineTo(boxResponseCenter, BOX_PLACING.Y + finished_trial.response);
    ctx.stroke();
}

const redraw_canvas = (box_size, line_length) => {
    let box_x = BOX_PLACING.X-(box_size/2);
    let box_y = BOX_PLACING.Y-(box_size/2);
    const ctx = CANVAS.getContext("2d");
    ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
    ctx.fillStyle = "black";
    ctx.strokeRect(box_x, box_y, box_size, box_size);
    ctx.beginPath();
    ctx.moveTo(BOX_PLACING.X, box_y);
    ctx.lineTo(BOX_PLACING.X, box_y + line_length);
    ctx.stroke();
}

const start_next_trial = (prompt_show_time=5000, prompt_callback=()=>{}, response_callback=()=>{}) => {
    if(++current_trial_count <= TRIALS.length) {
        let current_trial = TRIALS[current_trial_count-1];
        prompt_callback();
        set_box_to_center();
        current_line_length = current_trial.promptLineLength;
        current_box_size = current_trial.promptBoxSize;
        redraw_canvas(current_box_size, current_line_length);
        setTimeout( () => {
            CANVAS.style.visibility = 'hidden';
            BTN_PLUS.style.visibility = 'hidden';
            BTN_MINUS.style.visibility = 'hidden';
            WAIT_ANIMATION.style.visibility = 'visible';
            setTimeout(()=>{
                response_callback();
                if(RANDOM_POSITION) set_box_to_random(current_box_size);
                CANVAS.style.visibility = 'visible';
                BTN_PLUS.style.visibility = 'visible';
                BTN_MINUS.style.visibility = 'visible';
                WAIT_ANIMATION.style.visibility = 'hidden';

                current_box_size = current_trial.responseBoxSize;
                current_line_length = 0;
                redraw_canvas(current_box_size, current_line_length);
            }, prompt_show_time)
        }, prompt_show_time);
        return true;
    } else {
        return false;
    }
}

const finish_current_trial = (task_type) => {
    if(current_trial_count <= TRIALS.length) {
        TRIALS[current_trial_count-1].response = current_line_length;
        current_line_length = 0;
        current_box_size = 0;
        redraw_canvas(current_box_size, current_line_length);
        //TODO: remove listeners for every trial???
        return calculate_error(TRIALS[current_trial_count-1], task_type);
    } else {
        return null;
    }
}

const calculate_error = (responded_trial, trial_type='absolute') => {
    let correct_response = responded_trial.promptLineLength
    if(trial_type==='relative') {
        correct_response = Math.floor(responded_trial.responseBoxSize * responded_trial.promptLineLength/responded_trial.promptBoxSize)
    }
    responded_trial.error_abs = Math.floor(Math.abs(correct_response-responded_trial.response));
    responded_trial.error_perc = responded_trial.error_abs === 0 ? 0 : Math.floor(responded_trial.error_abs/correct_response*100);

    return JSON.parse(JSON.stringify(responded_trial));
}

const get_current_trial_number = () => {
    return current_trial_count;
}

const get_total_trials_number = () => {
    return TRIALS.length;
}

export {get_current_trial_number, get_total_trials_number, setup_canvas, start_next_trial, finish_current_trial, draw_trial_result}