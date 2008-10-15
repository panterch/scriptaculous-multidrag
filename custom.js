Event.observe(window, 'load', function() {
  Sortable.create('content', {
    tag: 'div',
    overlap: 'horizontal',
    constraint: false
    });
  Droppables.add('target', {
    onDrop: function(element) {
      $('messages').insert('Dropped '+element.id+'\n');
      }
    });
});


