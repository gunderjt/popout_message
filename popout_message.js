$.fn.popout_message = function(opts){
  //default settings
  var defaults = {
    //"this" stores the jquery selector context, it is necessary for comparisons later
    this : null,
    message : "",
    popout_position: {top: 15, left: 15},
    popout_css : { 
      "background-color": "#ffe", 
      "border-left": "5px solid #ccc",
      "width" : "500px",
      "height" : "50px"
    },
    popout_attr: {
      id: "hoverdiv",
    },
    popoutEventType: {"mouseenter": eventOn, "mouseleave": eventOff},
    popout: "<div></div>",
    popout_jquery_object: null,
    container: "body"
  };

  //initialize settings array if settings doesn't exist
  if(typeof $.fn.popout_message.settings === 'undefined'){
    $.fn.popout_message.settings = [];
  }
  //For every instance of popout, we need to save the settings for that instance
  var current_settings = create_options(opts);
  if ($.fn.popout_message.settings === false){
    console.error("Terminating: Invalid arguments: " + JSON.stringify(opts));
    return this;
  }
  else{
    //store context
    current_settings.this = this;
    //if use didn't pass in jquery object to use
    if(current_settings.popout_jquery_object === null || !current_settings.popout_jquery_object instanceof jQuery){
      current_settings.popout_jquery_object = create_popout(current_settings);
    }
    else{
      //check if object is attached to document
      if(!$.contains(document, current_settings.popout_jquery_object[0])){
        current_settings.popout_jquery_object.appendTo(current_settings.container)
      }
      current_settings.popout_jquery_object.hide();

    }
    //binds the element to the behavior
    this.bind(current_settings.popoutEventType);
    $.fn.popout_message.settings.push( current_settings );
  }
  return this;

  
  //Make this a private method
  function create_options(opts){
    if(typeof opts === "undefined"){
      return false;
    }
    else if(typeof opts === "string"){
      return $.extend (true, {}, defaults, {message: opts});
    }
    else if(typeof opts === "object" && opts.constructor !== Array){
      return $.extend (true, {}, defaults, opts);
    }
    else{
      return false;
    }
  }
  function find_settings(context){
    var settings = $.fn.popout_message.settings
    var relevant_settings = [];
    for (i = 0; i < settings.length; i++){
      if(settings[i].this.index(context) > -1){
        relevant_settings.push(settings[i]);
      }
    }
    return relevant_settings;
  }

  function create_popout(settings){
    try {
      //Avoid duplicate ids; if id exists, create an iterator 
      //and increment iterator until id+iterator doesn't exist
      if ($("#"+settings.popout_attr.id).length > 0){
        var iterator = 0;
        while ($("#"+settings.popout_attr.id+iterator).length > 0){
          iterator++;
        }
        settings.popout_attr.id +=iterator;
      }

      return $(settings.popout).hide().css(settings.popout_css)
           .attr(settings.popout_attr).html(settings.message).appendTo(settings.container);
    }
    catch(err) {
      console.error("Failed to create popout element: " + err);
      return false
    }
  };

  function eventOn() {
  //find the appropriate settings
    var settings = find_settings($(this));
    for (var i = 0; i < settings.length; i++){
      if (settings[i].popout_jquery_object !== null && settings[i].popout_jquery_object instanceof jQuery){
        //get the position of this
        var this_offset = $(this).offset();
        //show the image (necessary for $.offset() to work, )
        settings[i].popout_jquery_object.show().offset({top: this_offset.top + settings[i].popout_position.top, 
                                       left: this_offset.left + settings[i].popout_position.left});
      }
      else{
        console.error("eventOn failed: popout element doesn't exist or isn't a jQuery object; did you override \
          $.fn.popout_message.create_popout but not store the created popout element \
          in $.fn.popout_message.settings.popout_elem?");
      }
    }
  }

  function eventOff() {
    var settings = find_settings($(this));
    for (var i = 0; i < settings.length; i++){
      if (settings[i].popout_jquery_object !== null && settings[i].popout_jquery_object instanceof jQuery){
        settings[i].popout_jquery_object.hide();
      }
      else{
        console.error("eventOff failed: popout element doesn't exist or isn't a jQuery object; did you override \
          $.fn.popout_message.create_popout but not store the created popout element \
          in $.fn.popout_message.settings.popout_jquery_object?");
      }
    }
  }
};