/*************************************************************
 * litw.engine.js
 *
 * The LITW Engine is a minimalist take on how a study timeline
 * and its slides are handled and shown to study participants.
 *
 *
 * © Copyright 2024 - The LabintheWild Team
 * For questions about this file and permission to use
 * the code, contact us at tech@labinthewild.org
 *************************************************************/

const STUDY_STATUS_OPTIONS = {
    NEW: 'NEW',
    CONFIGURED: 'CONFIGURED',
    RUNNING: 'RUNNING',
    PAUSED: 'PAUSED',
    FINISHED: 'FINISHED',
    ERROR: 'ERROR'
}
const SLIDE_RUNTIME = {
    start: 0,
    duration: 0,
    data: {}
}

let timeline = {
    current_pos: -1,
    current_slide: null,
    slides: [],
    status: STUDY_STATUS_OPTIONS.NEW
}

let set_slides = (slides_config = []) => {
    if(timeline.status === STUDY_STATUS_OPTIONS.NEW) {
        //TODO check slides integrity
        timeline.slides = slides_config;
        return true;
    }
    return false;
}

function start_study() {
    console.log("STARTED!");
    timeline.status = STUDY_STATUS_OPTIONS.RUNNING;
}

function end_study() {
    console.log("FINISHED!");
    timeline.status = STUDY_STATUS_OPTIONS.FINISHED;
}

let advance_study = () => {
    if(timeline.status === STUDY_STATUS_OPTIONS.NEW) {
        start_study();
    }
    if(timeline.current_pos >= timeline.slides.length) {
        end_study();
        return false;
    }

    timeline.current_slide = timeline.slides[++timeline.current_pos];
    let slide = timeline.current_slide;
    //TODO Needs to be done via jQuery for now because the $.i18n library!
    let display_element = $('#' + slide.display_element_id);
    if('setup' in slide && typeof(slide.setup) === "function") {
        slide.setup();
    }

    let template_data = {};
    if(slide.template_data) {
        if(typeof(slide.template_data) === "function"){
            template_data = slide.template_data();
        } else {
            template_data = slide.template_data;
        }
    }

    display_element.html(slide.template(template_data));
    display_element.i18n();

    LITW.utils.showNextButton(function() {
        finish_slide();
    }, {submitKeys: []});

    //TODO Refactor
    if(slide.display_next_button) {
        document.getElementById('btn-next-page').style.display = 'none';
    }
    LITW.utils.showSlide(slide.display_element_id);
    LITW.tracking.recordSlideVisit(slide.name);
    return true;
};

let finish_slide = (slide_data = null) => {
    let slide = timeline.current_slide;
    document.getElementById(slide.display_element_id).innerHTML = '';
    slide.runtime = JSON.parse(JSON.stringify(SLIDE_RUNTIME));
    let time_now = new Date();
    slide.runtime.duration = time_now - slide.runtime.start;
    //TODO check if data is a JSON
    if(slide_data) {
        slide.runtime.data = JSON.parse(JSON.stringify(slide_data));
    }
    if(slide.finish) {
        slide.finish();
    }
    LITW.tracking.recordSlideTime(slide.name, slide.runtime.duration);
}

export {set_slides, advance_study};

