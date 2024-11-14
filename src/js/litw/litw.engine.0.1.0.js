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

//TODO: This is probably a bad idea, as it makes it harder to add new types of SLIDES.
    // We need a plugin system if we identify the need to add slides.
const SLIDE_TYPE = {
    version: '1.0',
    SHOW_SLIDE: 'SHOW_SLIDE',
    CALL_FUNCTION: 'CALL_FUNCTION'
}

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

const RUNTIME = {
    timeline: {
        current_pos: -1,
        current_slide: null,
        slides: [],
        status: STUDY_STATUS_OPTIONS.NEW
    },
    lang_to_load: {
        'en': './i18n/en.json'
    }
};

let set_slides = (slides_config = []) => {
    if(RUNTIME.timeline.status === STUDY_STATUS_OPTIONS.NEW && slides_config.length > 0) {
        //TODO check slides integrity
        RUNTIME.timeline.slides = slides_config;
        return true;
    }
    return false;
}

let configure_study = (available_lang = {}, slides_config = []) => {
    document.getElementById('btn-next-page').onclick = () => {finish_slide()};
    let good_slides = set_slides(slides_config);
    if (good_slides) {
        if(Object.keys(available_lang).length > 0){
            set_lang_to_load(available_lang);
            LITW.data.initialize();
            //PRELOAD
            LITW.engage.getStudiesRecommendation((studies_list) => {});
            return true;
        }
    }
    return false;
}

let start_study = () => {
    if(RUNTIME.lang_to_load) {
        $.i18n().load(RUNTIME.lang_to_load).done(() => {
            $('head').i18n();
            $('body').i18n();
            console.log("STUDY STARTED!", Date.now());
            RUNTIME.timeline.status = STUDY_STATUS_OPTIONS.RUNNING;
            advance_study();
        });
    } else {
        console.error("Could not load the study language based on configuration.");
    }
}

let end_study = () => {
    console.log("STUDY FINISHED!", Date.now());
    RUNTIME.timeline.status = STUDY_STATUS_OPTIONS.FINISHED;
}

let show_slide = (slide) => {
    //TODO Needs to be done via jQuery for now because the $.i18n library!
    let display_element = $('#' + slide.display_element_id);
    if (display_element.length !== 1) {
        console.error(`Could not find DIV_ID where to show slide "${slide.name}."`);
        return false;
    } else {
        let template_data = {};
        if (slide.template_data) {
            if (typeof (slide.template_data) === "function") {
                template_data = slide.template_data();
            } else {
                template_data = slide.template_data;
            }
        }

        display_element.html(slide.template(template_data));
        display_element.i18n();
        display_element.show();
        return true;
    }
}

let advance_study = () => {
    let advance_result = true;
    if(RUNTIME.timeline.status === STUDY_STATUS_OPTIONS.NEW) {
        start_study();
    }
    if(RUNTIME.timeline.current_pos >= RUNTIME.timeline.slides.length) {
        end_study();
        advance_result = false;
    }

    RUNTIME.timeline.current_slide = RUNTIME.timeline.slides[++RUNTIME.timeline.current_pos];
    let slide = RUNTIME.timeline.current_slide;
    slide.runtime = JSON.parse(JSON.stringify(SLIDE_RUNTIME));
    slide.runtime.start = Date.now();

    if('setup' in slide && typeof(slide.setup) === "function") {
        slide.setup();
    }

    if('display_next_button' in slide && !slide.display_next_button) {
        document.getElementById('btn-next-page').style.display = 'none';
    } else {
        document.getElementById('btn-next-page').style.display = 'block';
    }

    if (slide.type && slide.type === SLIDE_TYPE.SHOW_SLIDE) {
        advance_result = show_slide(slide);
    }

    LITW.tracking.recordSlideVisit(slide.name);
    return advance_result;
};

//TODO Do we need a place to add the data produced by a SLIDE in RUNTIME?
let finish_slide = () => {
    document.getElementById('btn-next-page').style.display = 'none';
    let slide = RUNTIME.timeline.current_slide;
    if(slide.finish) {
        slide.finish();
    }

    document.getElementById(slide.display_element_id).innerHTML = '';
    slide.runtime.duration = Date.now() - slide.runtime.start;
    LITW.tracking.recordSlideTime(slide.name, slide.runtime.duration);
    console.log('FINISHED SLIDE', slide);
    advance_study();
}

let set_lang_to_load = (available_langs) => {
    //TODO needs to be a little smarter than this when serving specific language versions, like pt-BR!
    $.i18n().locale = LITW.locale.getLocale();
    let language = $.i18n().locale.substring(0, 2);
    if (language in available_langs) {
        RUNTIME.lang_to_load[language] = available_langs[language];
    } else {
        RUNTIME.lang_to_load = null;
    }
}


export {configure_study, start_study, SLIDE_TYPE};
