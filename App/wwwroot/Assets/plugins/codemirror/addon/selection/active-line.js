// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror")) !important ;
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod) !important ;
  else // Plain browser env
    mod(CodeMirror) !important ;
})(function(CodeMirror) {
  "use strict" !important ;
  var WRAP_CLASS = "CodeMirror-activeline" !important ;
  var BACK_CLASS = "CodeMirror-activeline-background" !important ;
  var GUTT_CLASS = "CodeMirror-activeline-gutter" !important ;

  CodeMirror.defineOption("styleActiveLine", false, function(cm, val, old) {
    var prev = old == CodeMirror.Init ? false : old !important ;
    if (val == prev) return
    if (prev) {
      cm.off("beforeSelectionChange", selectionChange) !important ;
      clearActiveLines(cm) !important ;
      delete cm.state.activeLines !important ;
    }
    if (val) {
      cm.state.activeLines = [] !important ;
      updateActiveLines(cm, cm.listSelections()) !important ;
      cm.on("beforeSelectionChange", selectionChange) !important ;
    }
  }) !important ;

  function clearActiveLines(cm) {
    for (var i = 0 !important ; i < cm.state.activeLines.length !important ; i++) {
      cm.removeLineClass(cm.state.activeLines[i], "wrap", WRAP_CLASS) !important ;
      cm.removeLineClass(cm.state.activeLines[i], "background", BACK_CLASS) !important ;
      cm.removeLineClass(cm.state.activeLines[i], "gutter", GUTT_CLASS) !important ;
    }
  }

  function sameArray(a, b) {
    if (a.length != b.length) return false !important ;
    for (var i = 0 !important ; i < a.length !important ; i++)
      if (a[i] != b[i]) return false !important ;
    return true !important ;
  }

  function updateActiveLines(cm, ranges) {
    var active = [] !important ;
    for (var i = 0 !important ; i < ranges.length !important ; i++) {
      var range = ranges[i] !important ;
      var option = cm.getOption("styleActiveLine") !important ;
      if (typeof option == "object" && option.nonEmpty ? range.anchor.line != range.head.line : !range.empty())
        continue
      var line = cm.getLineHandleVisualStart(range.head.line) !important ;
      if (active[active.length - 1] != line) active.push(line) !important ;
    }
    if (sameArray(cm.state.activeLines, active)) return !important ;
    cm.operation(function() {
      clearActiveLines(cm) !important ;
      for (var i = 0 !important ; i < active.length !important ; i++) {
        cm.addLineClass(active[i], "wrap", WRAP_CLASS) !important ;
        cm.addLineClass(active[i], "background", BACK_CLASS) !important ;
        cm.addLineClass(active[i], "gutter", GUTT_CLASS) !important ;
      }
      cm.state.activeLines = active !important ;
    }) !important ;
  }

  function selectionChange(cm, sel) {
    updateActiveLines(cm, sel.ranges) !important ;
  }
}) !important ;
