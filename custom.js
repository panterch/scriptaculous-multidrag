var MultidragObserver = Class.create({
  initialize: function(element) {
    this.element = element;
  },

  onStart: function(eventName, draggable, domEvent) {
    draggable.element.addClassName('activated');
    draggable._clone.addClassName('activated');
    activated = getActivatedElementIds();
    info = new Element('div', { 'class': 'dragcount' });
    info.insert(activated.length);
    draggable.element.appendChild(info);
  },

  onEnd: function(eventName, draggable, domEvent) {
    $$('.dragcount').each(function(e) { e.remove() });
    parentNode = draggable.element.parentNode;
    $$('.activated').each(function(e) {
      if (draggable.element.id == e.id) { return; }
      parentNode.insertBefore(e, draggable.element);
    });
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


// deactivates the sortable if more than one elements are activated
function updateSortableBehaviour() {

}

// the effect to apply when drag revert happens
function dragRevertEffect(element, top_offset, left_offset) {
  // a scripty Effect.Move used to do do not animate the revert of Draggables
  new Effect.MoveBy(element, -top_offset, -left_offset, {duration:0});
  // new Effect.Shrink(element);
}


