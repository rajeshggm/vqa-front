// ------- old default setting that saved in storage ------------------------------------------------------------------
let storage_default_setting = localStorage.getItem("default_setting");
// ------- saved setting that saved in storage (user customize) -------------------------------------------------------
let saved_setting = localStorage.getItem("setting");

// ------- init saved setting and defualt setting befor every thing ---------------------------------------------------
get_storage_handler();
// ------- set setting object in equalizer data player js -------------------------------------------------------------
set_equalizer_setting_obj(saved_setting.equalizer);
// ------- set setting object in video features data player js --------------------------------------------------------
set_video_features_setting_obj(saved_setting.circular);
// ------- render equalizer settin in setting modal -------------------------------------------------------------------
init_equalizer_setting(saved_setting);
// ------- set setting object in video features data player js --------------------------------------------------------
init_video_features_setting(saved_setting);


// ====================================================================================================================
// ------- get and pars setting from storage and check if default setting changed by server PO ------------------------
// ====================================================================================================================
function get_storage_handler(){
    // first time using app .................................................................
    if (saved_setting == null){
        saved_setting = __defualt_setting__;
        localStorage.setItem("setting",JSON.stringify(saved_setting));
        localStorage.setItem("default_setting",JSON.stringify(__defualt_setting__));
    } 
    // else get setting from storage ........................................................    
    else {
        saved_setting = JSON.parse(saved_setting);
    }
    // check if defualt setting changed .....................................................
    if ( JSON.stringify(__defualt_setting__) != storage_default_setting ) {
        get_changes(saved_setting.circular,__defualt_setting__.circular);
        get_changes(saved_setting.equalizer,__defualt_setting__.equalizer);
        localStorage.setItem("default_setting",JSON.stringify(__defualt_setting__));
        localStorage.setItem("setting",JSON.stringify(saved_setting));
    }
}


// ====================================================================================================================
// ------- detect changed setting and set to current setting ----------------------------------------------------------
// ====================================================================================================================
function get_changes() {
    // check and set circular setting .......................................................
    for(let i = 0; i < __defualt_setting__.circular.length; i++ ) {
        let isFind = false;
        for ( let j=0; j<saved_setting.circular.length;j++){
            if (saved_setting.circular[j].id == __defualt_setting__.circular[i].id) {
                saved_setting.circular[j].name = __defualt_setting__.circular[i].name;
                if (!saved_setting.circular[j].gradiant_edit){
                    saved_setting.circular[j].gradiant = __defualt_setting__.circular[i].gradiant;
                }
                if (!saved_setting.circular[j].treshold_edit){
                    saved_setting.circular[j].value = __defualt_setting__.circular[i].value;
                }
                isFind = true;
                break;
            }
        }
        if (!isFind){
            saved_setting.circular.push(__defualt_setting__.circular[i])
        }
    }
    // remove extera setting that is not exist in default setting ...........................
    for(let i = 0; i < saved_setting.circular.length; i++ ) {
        let isFind = false;
        for (let j=0; j< __defualt_setting__.circular.length;j++){
            if (saved_setting.circular[i].id == __defualt_setting__.circular[j].id){
                isFind = true;
                break;
            }
        }
        if (!isFind){
            saved_setting.circular.splice(i,1);
            i--;
        }
    }
    // check and set equalizer setting .......................................................
    for(let i = 0; i < __defualt_setting__.equalizer.length; i++ ) {
        let isFind = false;
        for ( let j=0; j<saved_setting.equalizer.length;j++){
            if (saved_setting.equalizer[j].id == __defualt_setting__.equalizer[i].id) {
                saved_setting.equalizer[j].name = __defualt_setting__.equalizer[i].name;
                if (!saved_setting.equalizer[j].gradiant_edit){
                    saved_setting.equalizer[j].gradiant = __defualt_setting__.equalizer[i].gradiant;
                }
                if (!saved_setting.equalizer[j].treshold_edit){
                    saved_setting.equalizer[j].value = __defualt_setting__.equalizer[i].value;
                }
                isFind = true;
                break;
            }
        }
        if (!isFind){
            saved_setting.equalizer.push(__defualt_setting__.equalizer[i])
        }
    }
    // remove extera setting that is not exist in default setting ...........................
    for(let i = 0; i < saved_setting.equalizer.length; i++ ) {
        let isFind = false;
        for (let j=0; j< __defualt_setting__.equalizer.length;j++){
            if (saved_setting.equalizer[i].id == __defualt_setting__.equalizer[j].id){
                isFind = true;
                break;
            }
        }
        if (!isFind){
            saved_setting.equalizer.splice(i,1);
            i--;
        }
    }
}



// ====================================================================================================================
// ------- rendering equalizer setting --------------------------------------------------------------------------------
// ====================================================================================================================
function init_equalizer_setting(json) {
    $("#settingModal .equalizer-setting:not(.source)").remove();
    let eq_data = json.equalizer;
    for (let i = 0; i<eq_data.length;i++){
        let input = $("#settingModal .equalizer-setting.source").clone();
        input.removeClass("source");
        input.find(".h5").text(eq_data[i].name);
        input.find(".col-12 label").attr("for","equalizerTresholdVlaue"+i);
        input.find(".input-group input").attr("id","equalizerTresholdVlaue"+i);
        input.find(".equalizer-slider").attr("id", "equalizerSlider"+i);
        input.insertAfter("#settingModal .equalizer-setting.source");
        init_eq_slider("equalizerSlider"+i);
        set_equalizer_setting_value("equalizerTresholdVlaue"+i,"equalizerSlider"+i,eq_data[i].name);
    }
}



// ====================================================================================================================
// ------- rendering video features setting ---------------------------------------------------------------------------
// ====================================================================================================================
function init_video_features_setting(json){
    $("#settingModal .video-features-setting:not(.source)").remove();
    let vf_data = json.circular;
    for (let i = 0; i<vf_data.length;i++){
        let input = $("#settingModal .video-features-setting.source").clone();
        input.removeClass("source");
        input.find(".h5").text(vf_data[i].name);
        input.find(".col-12 label").attr("for","videoFeaturesTresholdVlaue"+i);
        input.find(".input-group input").attr("id","videoFeaturesTresholdVlaue"+i);
        input.find(".video-features-slider").attr("id", "videoFeaturesSlider"+i);
        input.insertAfter("#settingModal .video-features-setting.source");
        init_vf_slider("videoFeaturesSlider"+i);
        set_video_features_setting_value("videoFeaturesTresholdVlaue"+i,"videoFeaturesSlider"+i,vf_data[i].name)
    }

}




// ====================================================================================================================
// ------- set saved setting values to rendered setting ---------------------------------------------------------------
// ====================================================================================================================
function set_video_features_setting_value(inputID,sliderID,name) {
    let setting = saved_setting.circular;
    let isFound = false;
    let updateSlider = document.getElementById(sliderID);
    for ( let i = 0; i < setting.length; i++ ){
        if (setting[i].name == name){
            isFound = true;
            $("#"+inputID).val(setting[i].value);
            updateSlider.noUiSlider.updateOptions({
                start: setting[i].gradiant
            });
        }
    }
    if (!isFound){
        $("#"+inputID).val(0.5);
        setting.push({
            name:name,
            value: 0.5,
            gradiant:[0.25,0.5,0.75]
        });
    }
    saved_setting.circular = setting;
    updateSlider.noUiSlider.on('change', function (start) {
        change_video_feature(name,start);
    });
    $("#"+inputID).change( function () {
        change_video_feature_treshold(name,Number($("#"+inputID).val()));
    });
}



// ====================================================================================================================
// ------- on video feature slider change handler ---------------------------------------------------------------------
// ====================================================================================================================
function change_video_feature(name, start) {
    for (let i = 0; i< saved_setting.circular.length; i++ ){
        if (saved_setting.circular[i].name == name){
            saved_setting.circular[i].gradiant = [Number(start[0]),Number(start[1]),Number(start[2])];
            saved_setting.circular[i].gradiant_edit = true;
        }
    }
}



// ====================================================================================================================
// ------- on video feature treshold value change handler -------------------------------------------------------------
// ====================================================================================================================
function change_video_feature_treshold(name,value){
    for (let i = 0; i< saved_setting.circular.length; i++ ){
        if (saved_setting.circular[i].name == name){
            saved_setting.circular[i].value = value;
            saved_setting.circular[i].treshold_edit = true;
        }
    }
}



// ====================================================================================================================
// ------- set saved setting values to rendered setting ---------------------------------------------------------------
// ====================================================================================================================
function set_equalizer_setting_value(inputID,sliderID,name) {
    let setting = saved_setting.equalizer;
    let isFound = false;
    let updateSlider = document.getElementById(sliderID);
    for ( let i = 0; i < setting.length; i++ ){
        if (setting[i].name == name){
            isFound = true;

            $("#"+inputID).val(setting[i].value);
            updateSlider.noUiSlider.updateOptions({
                start: setting[i].gradiant
            });
        }
    }
    if (!isFound){
        $("#"+inputID).val(0.5);
        setting.push({
            name:name,
            value: 0.5,
            gradiant:[0.25,0.5,0.75]
        });
    }
    saved_setting.equalizer = setting;
    updateSlider.noUiSlider.on('change', function (start) {
        change_equalizer(name,start);
    });
    $("#"+inputID).change( function () {
        change_equalizer_treshold(name,$("#"+inputID).val());
    });
}



// ====================================================================================================================
// ------- on equalizer slider value change handler -------------------------------------------------------------------
// ====================================================================================================================
function change_equalizer(name, start) {
    for (let i = 0; i< saved_setting.equalizer.length; i++ ){
        if (saved_setting.equalizer[i].name == name){
            console.log(start);
            saved_setting.equalizer[i].gradiant = [Number(start[0]),Number(start[1]),Number(start[2])];
            saved_setting.equalizer[i].gradiant_edit = true;
        }
    }
}



// ====================================================================================================================
// ------- on equalizer treshold value slide change handler -----------------------------------------------------------
// ====================================================================================================================
function change_equalizer_treshold(name,value){
    for (let i = 0; i< saved_setting.equalizer.length; i++ ){
        if (saved_setting.equalizer[i].name == name){
            saved_setting.equalizer[i].value = Number(value);
            saved_setting.equalizer[i].treshold_edit = true;
        }
    }
}



// ====================================================================================================================
// ------- init equalizer slider --------------------------------------------------------------------------------------
// ====================================================================================================================
function init_eq_slider(id) {
    let slider = document.getElementById(id);
    noUiSlider.create(slider, {

        range: {
            'min': 0,
            'max': 1
        },
        step: 0.01,
        start: [0.25,0.5,0.75],
        connect: [true,true,true,true],
        behaviour: 'tap-drag',
        tooltips: true,
    });
    let connect = slider.querySelectorAll('.noUi-connect');
    for (var i = 0; i < connect.length; i++) {
        connect[i].style.backgroundColor=__eq_colors__[i] ;
    }
}



// ====================================================================================================================
// ------- init video features slider ---------------------------------------------------------------------------------
// ====================================================================================================================
function init_vf_slider(id) {
    let slider = document.getElementById(id);
    noUiSlider.create(slider, {

        range: {
            'min': 0,
            'max': 100
        },
        step: 1,
        start: [25,50,75],
        connect: [true,true,true,true],
        behaviour: 'tap-drag',
        tooltips: true,
    });
    let connect = slider.querySelectorAll('.noUi-connect');
    for (var i = 0; i < connect.length; i++) {
        connect[i].style.backgroundColor=__eq_colors__[i] ;
    }
}



// ====================================================================================================================
// ------- on modal save button click handler -------------------------------------------------------------------------
// ====================================================================================================================
$("#settingModal .modal-footer button.save").click(function(){
    localStorage.setItem("setting",JSON.stringify(saved_setting));
    set_equalizer_setting_obj(saved_setting.equalizer);
    set_video_features_setting_obj(saved_setting.circular);
    $('#settingModal').modal('hide');
})



// ====================================================================================================================
// ------- on modal hide handler --------------------------------------------------------------------------------------
// ====================================================================================================================
$('#settingModal').on('hidden.bs.modal', function (e) {
    saved_setting = localStorage.getItem("setting");
    saved_setting = JSON.parse(saved_setting);
    init_equalizer_setting(saved_setting);
    init_video_features_setting(saved_setting);
});



// ====================================================================================================================
// ------- on modal reset button click handler ------------------------------------------------------------------------
// ====================================================================================================================
$("#areYouSure .reset").click(function(){
    saved_setting = __defualt_setting__;
    localStorage.setItem("setting",JSON.stringify(__defualt_setting__));
    init_equalizer_setting(saved_setting);
    init_video_features_setting(saved_setting);
    set_equalizer_setting_obj(saved_setting.equalizer);
    set_video_features_setting_obj(saved_setting.circular);
})