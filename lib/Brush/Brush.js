/**
 * Expose the Brush module
 */
whiteboard.Brush = (function(_){

  var _brushes = {},
  /**
   * A Brush knows its template and name, and it can paint new strokes 
   *    (copies of the template) onto the DOM
   *
   * It's basically a stroke factory
   *
   * @attribute {Element} element - a stroke template
   * @attribute {string} name 
   */
  Brush = function(template, name){
    this.template = template;
    this.name = name;
  };

  /**
   * ------------------------------
   * Module Variables/Methods
   * ------------------------------
   */

  Brush.active = null;

  /**
   * Find all brushes and their tool-buttons in the DOM
   *   Register brushes with module
   *   Set tool-button click handlers
   *   
   * @return void
   * @api public
   */
  Brush.init = function() {
    var brushes = document.getElementsByClassName('brush'),
        brushButtons = document.getElementsByClassName('tool');

    for (var i = 0; i < brushes.length; i++)
      Brush.add(brushes[i]);

    for (var i = 0; i < brushButtons.length; i++)
      _.addEvent(brushButtons[i], 'click', _setActiveBrush);

    _.addEvent(document, 'mousedown', function(e){
      if (_shouldPaintStroke(e))
        _paintStroke(e);
    });

  };

  /**
   * register a new brush type
   * should be a DOM element with which the contents will be used to paint
   * see HTML data-attribute API reference
   *
   * @param {Element} element
   * @returns {whiteboard}
  */
  Brush.add = function(element) {
    var name = element.attributes.getNamedItem('data-brush-name').value;
    _brushes[name] = new Brush(element, name);
    return this;
  };

  /**
   * Get a known singleton brush object by name
   *
   * @param {string} name
   * @returns {Brush}
   */
  Brush.get = function(name) {
    return _brushes[name];
  };

  /**
   * ----------------
   * Instance Methods
   * ----------------
   */

  /**
   * Paint a new copy of a brush's template onto the DOM
   * Initialize all DOM listeners for strokeActions on the stroke.
   *
   * @returns {Stroke} newly painted stroke 
   */
  Brush.prototype.paintStroke = function(stroke) {
    if (stroke) {
      stroke = _.Stroke.create({json: stroke});
    } else {
      stroke = _.Stroke.create({brush: this});
    }
    _.emit("Brush."+this.name+".paint.commit", {
        module: "Brush",
        action: "paint",
        step: "commit",
        stroke: stroke,
        brush: this
    });

    return stroke; 
  };

  /**
   * ---------------
   * Private Methods
   * ---------------
   */

  
  /**
   * Get the brush corresponding to a tool's click event target
   * 
   * @param {Event} e
   * @returns {Brush}
   */
  function _brushFromEvent(e) {
    var name = e.currentTarget.attributes.getNamedItem('data-brush-name').value;
    return _brushes[name];
  };
  
  /**
   *  Set the active brush using a tool's click event
   *
   *  @param {Event} e
   *  @return {Brush}
   *  @api private
   */
  function _setActiveBrush(e) {
    if (e.preventDefault) e.preventDefault();  
    Brush.active = _brushFromEvent(e);
    return Brush;
  };

    /**
   * Determine if the event deserves a brush stroke
   *
   * @param {Event} e
   * @return {boolean}
   * @api private
   */
  function _shouldPaintStroke(e) {
    return Brush.active && !e.defaultPrevented &&
        !e.target.isContainedInElementOfClass('stroke') && 
        !e.target.isContainedInElementOfClass('toolbox');
  };

  /**
   *  Paint a stroke with the active brush. 
   *  Handles key-binds for composition
   *
   *  preconditions:: Brush.active != null
   *      Use _shouldPaintStroke to be sure
   *
   *  @param {Event} e
   *  @returns {Brush}
   *  @api private
   */
  function _paintStroke(e) {
    Brush.active.paintStroke();
    if (!e.shiftKey) 
      Brush.active = null;

    return Brush;
  };


    return Brush;
  })(whiteboard);
