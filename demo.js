// script.aculo.us multi drag and drop add on demo
//
// See http://www.github.com/panter/scriptaculous-multidrag/
// and http://script.aculo.us/
// for more information
//
// script.aculo.us is freely distributable under the terms of an MIT-style
// license. For details, see the web site:http://script.aculo.us/
//
// The multi d&d add on code is in the public domain.
//
// This add-on enables multiple selections for scripty draggables and
// sortables.
// 
// Please note that the sortable add on needs a slightly patched version of
// dragdrop.js.

Event.observe(window, 'load', function() {
    createDropZone();
    createSortable();
});

// create a drop zone outside the sortable
function createDropZone() {
  Droppables.add('target', {
    onHover: function(draggable, droppable, percetage) {
      Sortable.unmark();
      // we use the _marker to signal the patched scripty sortable that we
      // received the drop and it should let things ordered as they are.
      Sortable._marker = null;
    },
    onDrop: function(element) {
      activated = getActivatedElementIds();
      message('Dropped: '+activated.map(function(e) {
          return e.substring(e.indexOf('_')+1);
          }).sort().join(', '));
      }
    });
}

// creates the scripty sortable and register all needed observers
function createSortable() {
  container = $('sortable');
  // register our sortable support for multiple elements listener - order
  // matters here, you have to register it before creating the Sortable
  Draggables.addObserver(new MultisortObserver(container));
  Sortable.create(container.id, {
    overlap: 'horizontal',
    ghosting: true,
    scroll: window,
    reverteffect: immediateRevertEffect,
    constraint: false,
    onUpdate: function() {
       if (null == Sortable._marker) return;
       message('New order: '+ Sortable.sequence(this.element).join(', ')); 
    }
    });
  // register the multi element d&d observer. In case you would be working with
  // mere Draggables and not a Sortable, this would be all you had to do
  Draggables.addObserver(new MultidragObserver(container));
}

// write msg to the target area
function message(msg) {
  $('target').insert({'top': '<li>'+msg+'</li>'});
  new Effect.Highlight('target', { endcolor: '#f0f0f0', restorecolor: '#f0f0f0' });
}
