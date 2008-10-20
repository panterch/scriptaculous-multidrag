var MultidragObserver = Class.create({
  initialize: function(element) {
    this.element = element;
    this.lastSequence = Sortable.sequence(this.element);
  },

  onStart: function(eventName, draggable, domEvent) {
    draggable.element.addClassName('activated');
    draggable._clone.addClassName('activated');
    activated = getActivatedElementIds();
    info = new Element('div', { 'class': 'dragcount' });
    info.insert(activated.length);
    draggable.element.appendChild(info);
    this.lastSequence = Sortable.sequence(this.element);
  },

  onEnd: function(eventName, draggable, domEvent) {
    $$('.dragcount').each(function(e) { e.remove() });
    // do nothing if the drop area has reveived the elements
    if (null == Sortable._marker) { return; }

    parentNode = draggable.element.parentNode;
    origindex = this.lastSequence.indexOf(draggable.element.id.substring(1+draggable.element.id.indexOf('_')));
    
    // drop the other activated elements near the just dropped draggable
    rightSibling = draggable.element;
    $$('.activated').each(function(e) {
      if (draggable.element.id != e.id) {
        id = e.id.substring(1+e.id.indexOf('_'));
        if (this.lastSequence.indexOf(id) < origindex) {
          parentNode.insertBefore(e, draggable.element);
        } else {
          parentNode.insertBefore(e, rightSibling.nextSibling);
          rightSibling = e;
        }
      }
    }, this);
  }

});
    


Event.observe(window, 'load', function() {
  // create the scripty sortable
  Sortable.create('content', {
    tag: 'div',
    overlap: 'horizontal',
    ghosting: true,
    scroll: window,
    reverteffect: dragRevertEffect,
    constraint: false
    });
  // create a drop zone outside the sortable
  Droppables.add('target', {
    onHover: function(draggable, droppable, percetage) {
      Sortable.unmark();
      // we use the _marker to signal the patched scripty sortable that we
      // received the drop and it should let things ordered as they are.
      Sortable._marker = null;
    },
    onDrop: function(element) {
      activated = getActivatedElementIds();
      $('target').insert({'top': 'Dropped '+activated.sort().join(', ')+'\n'});
      }
    });
  // register our multidrag listener
  Draggables.addObserver(new MultidragObserver($('content')));
  // register additional behaviour on the sortables draggables
  Sortable.sortables.content.draggables.each(function(draggable) {
    draggable.element.observe('mousedown', function() {
      draggable.element.toggleClassName('activated');
    });
  });
});

// returns an array of elements that are in state activated. the element you
// pass as parameter is returned in any case.
function getActivatedElementIds() {
  activated = [].concat($$('.activated'));
  activated = activated.pluck('id').uniq();
  return activated;
}


// the effect to apply when drag revert happens
function dragRevertEffect(element, top_offset, left_offset) {
  postop = parseFloat(element.style.top) - top_offset;
  posleft = parseFloat(element.style.left) - left_offset;
  element.setStyle({
    left: posleft.round() + 'px',
    top:  postop.round()  + 'px'
  });
}


