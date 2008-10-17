Event.observe(window, 'load', function() {
  Sortable.create('content', {
    tag: 'div',
    overlap: 'horizontal',
    ghosting: true,
    scroll: window,
    reverteffect: dragRevertEffect,
    constraint: false
    });
  Droppables.add('target', {
    onDrop: function(element) {
      $('messages').insert({'top': 'Dropped '+element.id+'\n'});
      }
    });
});

// the effect to apply when drag revert happens
function dragRevertEffect(element, top_offset, left_offset) {
  // a scripty Effect.Move used to do do not animate the revert of Draggables
  new Effect.MoveBy(element, -top_offset, -left_offset, {duration:0});
  // new Effect.Shrink(element);
}


