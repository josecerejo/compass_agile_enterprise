function codemirrorHighlight(target_id) {
  modes = CodeMirror.listModes();
  for (var x = 0; x < modes.length; x++){
    if (modes[x] != 'null'){
      tags = document.getElementById(target_id).getElementsByTagName(modes[x]);
      for (var i = 0; i < tags.length; i++) {
        output = tags[i];
        output.className += ' cm-s-default';
        output.style.cssText = "white-space: pre;";
        CodeMirror.runMode(tags[i].innerHTML, modes[x],  output);
      }            
    }
  }
}