// Make #SetPiece draggable without jQuery UI
(function() {
  var dragTarget = document.getElementById('SetPiece');
  if (!dragTarget) return;
  dragTarget.style.cursor = 'move';
  var offsetX = 0, offsetY = 0, isDragging = false;

  dragTarget.addEventListener('mousedown', function(e) {
    isDragging = true;
    var rect = dragTarget.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    dragTarget.style.left = (e.clientX - offsetX) + 'px';
    dragTarget.style.top = (e.clientY - offsetY) + 'px';
    dragTarget.style.right = '';
    dragTarget.style.bottom = '';
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
    document.body.style.userSelect = '';
  });
})();
