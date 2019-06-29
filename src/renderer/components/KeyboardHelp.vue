<template>
  <div
    id="container"
    class="container-fluid">

    <h1>Keyboard Shortcuts</h1>

    <h2>Table Editor Shortcuts</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width:50%">Table Editing shortcuts</th>
          <th style="width:25%"><i class="fab fa-windows fa-lg"/> &nbsp; <i class="fab fa-linux fa-lg"/></th>
          <th style="width:25%"><i class="fab fa-apple fa-lg"/></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Insert row below</b>, if in last row</td>
          <td><kbd>Enter</kbd></td>
          <td><kbd>Enter</kbd></td>
        </tr>
        <tr>
          <td><b>Insert column after</b> if in last column</td>
          <td><kbd>Tab</kbd></td>
          <td><kbd>Tab</kbd></td>
        </tr>
        <tr>
          <td><b>Cancel</b> data entry</td>
          <td><kbd>Esc</kbd></td>
          <td><kbd>Esc</kbd></td>
        </tr>
        <tr>
          <td><b>Delete</b> cell contents</td>
          <td><kbd>Backspace</kbd> or <kbd>Delete</kbd></td>
          <td><kbd>Delete</kbd></td>
        </tr>
        <tr>
          <td><b>Fill all selected</b> cells with the same value</td>
          <td><kbd>Ctrl</kbd> <kbd>Enter</kbd></td>
          <td><kbd>Command &#8984;</kbd> <kbd>Enter</kbd></td>
        </tr>
      </tbody>
    </table>

    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width:50%">Table Navigation shortcuts</th>
          <th style="width:25%"><i class="fab fa-windows fa-lg"/> &nbsp; <i class="fab fa-linux fa-lg"/></th>
          <th style="width:25%"><i class="fab fa-apple fa-lg"/></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Move Up</b> from the current cell</td>
          <td><kbd>&#8593;</kbd></td>
          <td><kbd>&#8593;</kbd></td>
        </tr>
        <tr>
          <td><b>Move Down</b> from the current cell</td>
          <td><kbd>&#8595;</kbd></td>
          <td><kbd>&#8595;</kbd></td>
        </tr>
        <tr>
          <td><b>Move Right</b> from the current cell</td>
          <td><kbd>&#8594;</kbd> or <kbd>Tab</kbd></td>
          <td><kbd>&#8594;</kbd> or <kbd>Tab</kbd></td>
        </tr>
        <tr>
          <td><b>Move Left</b> from the current cell</td>
          <td><kbd>&#8592;</kbd> or <kbd>Shift &#8679;</kbd> <kbd>Tab</kbd></td>
          <td><kbd>&#8592;</kbd> or <kbd>Shift &#8679;</kbd> <kbd>Tab</kbd></td>
        </tr>
        <tr>
          <td><b>Move to Top</b> cell in the current column</td>
          <td><kbd>Ctrl</kbd> <kbd>Home</kbd></td>
          <td><kbd>Command &#8984;</kbd> <kbd>fn</kbd> <kbd>&#8593;</kbd></td>
        </tr>
        <tr>
          <td><b>Move to Bottom</b> cell in the current column</td>
          <td><kbd>Ctrl</kbd> <kbd>End</kbd></td>
          <td><kbd>Command &#8984;</kbd> <kbd>fn</kbd> <kbd>&#8595;</kbd></td>
        </tr>
        <tr>
          <td><b>Move to First</b> cell in the current row</td>
          <td><kbd>Home</kbd></td>
          <td><kbd>fn</kbd> <kbd>&#8592;</kbd></td>
        </tr>
        <tr>
          <td><b>Move to Last</b> cell in the current row</td>
          <td><kbd>End</kbd></td>
          <td><kbd>fn</kbd> <kbd>&#8594;</kbd></td>
        </tr>
      </tbody>
    </table>

    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width:50%">Table Selection shortcuts</th>
          <th style="width:25%"><i class="fab fa-windows fa-lg"/> &nbsp; <i class="fab fa-linux fa-lg"/></th>
          <th style="width:25%"><i class="fab fa-apple fa-lg"/></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Select All</b> the data in the table</td>
          <td><kbd>Ctrl</kbd> <kbd>A</kbd> </td>
          <td><kbd>Command &#8984;</kbd> <kbd>A</kbd></td>
        </tr>
        <tr>
          <td><b>Select Up</b> - expand column selection to the cell above</td>
          <td><kbd>Shift &#8679;</kbd> <kbd>&#8593;</kbd></td>
          <td><kbd>Shift &#8679;</kbd> <kbd>&#8593;</kbd></td>
        </tr>
        <tr>
          <td><b>Select Down</b> - expand column selection to the cell below</td>
          <td><kbd>Shift &#8679;</kbd> <kbd>&#8595;</kbd></td>
          <td><kbd>Shift &#8679;</kbd> <kbd>&#8595;</kbd></td>
        </tr>
        <tr>
          <td><b>Select Right</b> - expand row selection to the cell right</td>
          <td><kbd>Shift &#8679;</kbd> <kbd>&#8594;</kbd></td>
          <td><kbd>Shift &#8679;</kbd> <kbd>&#8594;</kbd></td>
        </tr>
        <tr>
          <td><b>Select Left</b> - expand row selection to the cell left</td>
          <td><kbd>Shift &#8679;</kbd> <kbd>&#8592;</kbd></td>
          <td><kbd>Shift &#8679;</kbd> <kbd>&#8592;</kbd></td>
        </tr>
        <tr>
          <td><b>Select to Top</b> - expand column selection to all cells above</td>
          <td><kbd>Ctrl</kbd> <kbd>Shift &#8679;</kbd> <kbd>Home</kbd></td>
          <td><kbd>Command &#8984;</kbd> <kbd>Shift &#8679;</kbd> <kbd>fn</kbd> <kbd>&#8593;</kbd></td>
        </tr>
        <tr>
          <td><b>Select to Bottom</b> - expand column selection to all cells below</td>
          <td><kbd>Ctrl</kbd> <kbd>Shift &#8679;</kbd> <kbd>End</kbd></td>
          <td><kbd>Command &#8984;</kbd> <kbd>Shift &#8679;</kbd> <kbd>fn</kbd> <kbd>&#8595;</kbd></td>
        </tr>
        <tr>
          <td><b>Select to First</b> - expand row selection to all cells to the right</td>
          <td><kbd>Shift &#8679;</kbd> <kbd>Home</kbd></td>
          <td><kbd>Shift &#8679;</kbd> <kbd>fn</kbd> <kbd>&#8592;</kbd></td>
        </tr>
        <tr>
          <td><b>Select to Last</b> - expand row selection to all cells to the left</td>
          <td><kbd>Shift &#8679;</kbd> <kbd>End</kbd></td>
          <td><kbd>Shift &#8679;</kbd> <kbd>fn</kbd> <kbd>&#8594;</kbd></td>
        </tr>
      </tbody>
    </table>

    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width:50%">Context menu shortcuts</th>
          <th style="width:25%"><i class="fab fa-windows fa-lg"/> &nbsp; <i class="fab fa-linux fa-lg"/></th>
          <th style="width:25%"><i class="fab fa-apple fa-lg"/></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Right click</b> in a cell to display the context menu</td>
          <td><i class="fa fa-mouse-pointer"/></td>
          <td><i class="fa fa-mouse-pointer"/></td>
        </tr>
        <tr>
          <td><b>Choose Next</b> option in context menu</td>
          <td><kbd>&#8593;</kbd></td>
          <td><kbd>&#8593;</kbd></td>
        </tr>
        <tr>
          <td><b>Choose Previous</b> option in context menu</td>
          <td><kbd>&#8595;</kbd></td>
          <td><kbd>&#8595;</kbd></td>
        </tr>
        <tr>
          <td><b>Perform Option</b> from context menu</td>
          <td><kbd>Enter</kbd></td>
          <td><kbd>Enter</kbd></td>
        </tr>
      </tbody>
    </table>

    <h2>Menu Shortcuts</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width:50%">Data Curator menu shortcuts</th>
          <th style="width:25%"><i class="fab fa-windows fa-lg"/> &nbsp; <i class="fab fa-linux fa-lg"/></th>
          <th style="width:25%"><i class="fab fa-apple fa-lg"/></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Preferences</b> - set defaults to improve productivity</td>
          <td/>
          <td><kbd>Command &#8984;</kbd> <kbd>,</kbd></td>
        </tr>
        <tr>
          <td><b>Hide</b> the application</td>
          <td/>
          <td><kbd>Command &#8984;</kbd> <kbd>H</kbd></td>
        </tr>
        <tr>
          <td><b>Hide Others</b> - hide all other applications</td>
          <td/>
          <td><kbd>Option &#8997;</kbd> <kbd>Command &#8984;</kbd> <kbd>H</kbd></td>
        </tr>
        <tr>
          <td><b>Quit Data Curator</b> - close the application (prompt to save unsaved work)</td>
          <td><kbd>Ctrl</kbd> <kbd>Q</kbd></td>
          <td><kbd>Command &#8984;</kbd> <kbd>Q</kbd></td>
        </tr>
      </tbody>
    </table>

    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width:50%">File menu shortcuts</th>
          <th style="width:25%"><i class="fab fa-windows fa-lg"/> &nbsp; <i class="fab fa-linux fa-lg"/></th>
          <th style="width:25%"><i class="fab fa-apple fa-lg"/></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>New</b> - create a new data table</td>
          <td><kbd>Ctrl</kbd> <kbd>N</kbd></td>
          <td><kbd>Command &#8984;</kbd> <kbd>N</kbd></td>
        </tr>
        <tr>
          <td><b>Open</b>, <b>Comma Separated</b> value file</td>
          <td><kbd>Ctrl</kbd> <kbd>O</kbd></td>
          <td><kbd>Command &#8984;</kbd> <kbd>O</kbd></td>
        </tr>
        <tr>
          <td><b>Save</b> the active data tab as a CSV file</td>
          <td><kbd>Ctrl</kbd> <kbd>S</kbd></td>
          <td><kbd>Command &#8984;</kbd> <kbd>S</kbd></td>
        </tr>
        <tr>
          <td><b>Save As</b>, <b>Comma Separated</b> - save the active data tab with a new filename or location</td>
          <td><kbd>Shift &#8679;</kbd> <kbd>Ctrl</kbd> <kbd>S</kbd></td>
          <td><kbd>Shift &#8679;</kbd> <kbd>Command &#8984;</kbd> <kbd>S</kbd></td>
        </tr>
        <!-- https://github.com/ODIQueensland/data-curator/issues/67
      <tr>
        <td><b>Close Tab</b> - close the active data tab</td>
        <td><kbd>Ctrl</kbd> <kbd>W</kbd></td>
        <td><kbd>Command &#8984;</kbd> <kbd>W</kbd></td>
      </tr>
-->
      </tbody>
    </table>

    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width:50%">Edit menu shortcuts</th>
          <th style="width:25%"><i class="fab fa-windows fa-lg"/> &nbsp; <i class="fab fa-linux fa-lg"/></th>
          <th style="width:25%"><i class="fab fa-apple fa-lg"/></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Undo</b> the last edit command. Replace commands cannot be undone</td>
          <td><kbd>Ctrl</kbd> <kbd>Z</kbd></td>
          <td><kbd>Command &#8984;</kbd> <kbd>Z</kbd></td>
        </tr>
        <tr>
          <td><b>Redo</b> - Undo the last Undo command</td>
          <td><kbd>Ctrl</kbd> <kbd>Y</kbd></td>
          <td><kbd>Shift &#8679;</kbd> <kbd>Command &#8984;</kbd> <kbd>Z</kbd></td>
        </tr>
        <tr>
          <td><b>Cut</b> - move the selected data to the clipboard</td>
          <td><kbd>Ctrl</kbd> <kbd>X</kbd></td>
          <td><kbd>Command &#8984;</kbd> <kbd>X</kbd></td>
        </tr>
        <tr>
          <td><b>Copy</b> the selected data to the clipboard</td>
          <td><kbd>Ctrl</kbd> <kbd>C</kbd></td>
          <td><kbd>Command &#8984;</kbd> <kbd>C</kbd></td>
        </tr>
        <tr>
          <td><b>Paste</b> the clipboard contents to the selected location</td>
          <td><kbd>Ctrl</kbd> <kbd>V</kbd></td>
          <td><kbd>Command &#8984;</kbd> <kbd>V</kbd></td>
        </tr>
        <!-- see https://github.com/ODIQueensland/data-curator/issues/89
      <tr>
        <td><b>Select All</b> the data in the table</td>
        <td><kbd>Ctrl</kbd> <kbd>A</kbd> </td>
        <td><kbd>Command &#8984;</kbd> <kbd>A</kbd></td>
      </tr>
-->
        <tr>
          <td><b>Insert Row Above</b> - add an empty row above the current cell</td>
          <td><kbd>Ctrl</kbd> <kbd>I</kbd></td>
          <td><kbd>Command &#8984;</kbd> <kbd>I</kbd></td>
        </tr>
        <tr>
          <td><b>Insert Row Below</b> - add an empty row below the current cell</td>
          <td><kbd>Ctrl</kbd> <kbd>M</kbd></td>
          <td><kbd>Command &#8984;</kbd> <kbd>M</kbd></td>
        </tr>
        <tr>
          <td><b>Insert Column Before</b> - add an empty column left of the current cell</td>
          <td><kbd>Ctrl</kbd> <kbd>J</kbd></td>
          <td><kbd>Command &#8984;</kbd> <kbd>J</kbd></td>
        </tr>
        <tr>
          <td><b>Insert Column After</b> - add an empty column right of the current cell</td>
          <td><kbd>Ctrl</kbd> <kbd>K</kbd></td>
          <td><kbd>Command &#8984;</kbd> <kbd>K</kbd></td>
        </tr>
      </tbody>
    </table>
    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width:50%">Find menu shortcuts</th>
          <th style="width:25%"><i class="fab fa-windows fa-lg"/> &nbsp; <i class="fab fa-linux fa-lg"/></th>
          <th style="width:25%"><i class="fab fa-apple fa-lg"/></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Find</b> </td>
          <td><kbd>Ctrl</kbd> <kbd>F</kbd></td>
          <td><kbd>Command &#8984;</kbd> <kbd>F</kbd></td>
        </tr>
        <tr>
          <td><b>Find Next</b> </td>
          <td><kbd>Ctrl</kbd> <kbd>G</kbd></td>
          <td><kbd>Command &#8984;</kbd> <kbd>G</kbd></td>
        </tr>
        <tr>
          <td><b>Find Previous</b></td>
          <td><kbd>Alt</kbd> <kbd>Ctrl</kbd> <kbd>G</kbd></td>
          <td><kbd>Option &#8997;</kbd> <kbd>Command &#8984;</kbd> <kbd>G</kbd></td>
        </tr>
        <tr>
          <td><b>Replace Next</b></td>
          <td><kbd>Ctrl</kbd> <kbd>E</kbd></td>
          <td><kbd>Command &#8984;</kbd> <kbd>E</kbd></td>
        </tr>
        <tr>
          <td><b>Replace Previous</b></td>
          <td><kbd>Alt</kbd> <kbd>Ctrl</kbd> <kbd>E</kbd></td>
          <td><kbd>Option &#8997;</kbd> <kbd>Command &#8984;</kbd> <kbd>E</kbd></td>
        </tr>
      </tbody>
    </table>
    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width:50%">Tools menu shortcuts</th>
          <th style="width:25%"><i class="fab fa-windows fa-lg"/> &nbsp; <i class="fab fa-linux fa-lg"/></th>
          <th style="width:25%"><i class="fab fa-apple fa-lg"/></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Header Row</b> - Freeze first row and use values for Column Name</td>
          <td><kbd>Shift &#8679;</kbd> <kbd>Ctrl</kbd> <kbd>H</kbd></td>
          <td><kbd>Shift &#8679;</kbd> <kbd>Command &#8984;</kbd> <kbd>H</kbd></td>
        </tr>
        <tr>
          <td><b>Guess Column Properties</b> - set Type and Format based on column values</td>
          <td><kbd>Shift &#8679;</kbd> <kbd>Ctrl</kbd> <kbd>G</kbd></td>
          <td><kbd>Shift &#8679;</kbd> <kbd>Command &#8984;</kbd> <kbd>G</kbd></td>
        </tr>
        <tr>
          <td><b>Set Column Properties</b></td>
          <td><kbd>Shift &#8679;</kbd> <kbd>Ctrl</kbd> <kbd>C</kbd></td>
          <td><kbd>Shift &#8679;</kbd> <kbd>Command &#8984;</kbd> <kbd>C</kbd></td>
        </tr>
        <tr>
          <td><b>Set Table Properties</b></td>
          <td><kbd>Shift &#8679;</kbd> <kbd>Ctrl</kbd> <kbd>T</kbd></td>
          <td><kbd>Shift &#8679;</kbd> <kbd>Command &#8984;</kbd> <kbd>T</kbd></td>
        </tr>
        <tr>
          <td><b>Set Provenance Information</b></td>
          <td><kbd>Shift &#8679;</kbd> <kbd>Ctrl</kbd> <kbd>P</kbd></td>
          <td><kbd>Shift &#8679;</kbd> <kbd>Command &#8984;</kbd> <kbd>P</kbd></td>
        </tr>
        <tr>
          <td><b>Set Data Package Properties</b></td>
          <td><kbd>Shift &#8679;</kbd> <kbd>Ctrl</kbd> <kbd>D</kbd></td>
          <td><kbd>Shift &#8679;</kbd> <kbd>Command &#8984;</kbd> <kbd>D</kbd></td>
        </tr>
        <tr>
          <td><b>Validate Table</b> (uses Column Properties if set)</td>
          <td><kbd>Shift &#8679;</kbd> <kbd>Ctrl</kbd> <kbd>V</kbd></td>
          <td><kbd>Shift &#8679;</kbd> <kbd>Command &#8984;</kbd> <kbd>V</kbd></td>
        </tr>
        <tr>
          <td><b>Export Data Package</b> - save all data and properties to a .zip file</td>
          <td><kbd>Shift &#8679;</kbd> <kbd>Ctrl</kbd> <kbd>X</kbd></td>
          <td><kbd>Shift &#8679;</kbd> <kbd>Command &#8984;</kbd> <kbd>X</kbd></td>
        </tr>
      </tbody>
    </table>

    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width:50%">Window menu shortcuts</th>
          <th style="width:25%"><i class="fab fa-windows fa-lg"/> &nbsp; <i class="fab fa-linux fa-lg"/></th>
          <th style="width:25%"><i class="fab fa-apple fa-lg"/></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Minimize</b> - minimize the Data Curator window</td>
          <td/>
          <td><kbd>Command &#8984;</kbd> <kbd>M</kbd></td>
        </tr>
        <!--  see https://github.com/ODIQueensland/data-curator/issues/273
      <tr>
        <td><b>Next Tab</b> - make the next tab (if it exists) the active tab</td>
        <td><kbd>Ctrl</kbd> <kbd>&#8594;</kbd></td>
        <td><kbd>Command &#8984;</kbd> <kbd>&#8594;</kbd></td>
      </tr>
      <tr>
        <td><b>Previous Tab</b> - make the previous tab (if it exists) the active tab</td>
        <td><kbd>Ctrl</kbd> <kbd>&#8592;</kbd></td>
        <td><kbd>Command &#8984;</kbd> <kbd>&#8592;</kbd></td>
      </tr>
-->
      </tbody>
    </table>

    <table class="table table-striped final">
      <thead>
        <tr>
          <th style="width:50%">Help menu shortcuts</th>
          <th style="width:25%"><i class="fab fa-windows fa-lg"/> &nbsp; <i class="fab fa-linux fa-lg"/></th>
          <th style="width:25%"><i class="fab fa-apple fa-lg"/></th>
        </tr>
      </thead>
      <tbody>
        <!--
      <tr>
        <td><b>Data Curator Help</b> - display help in a separate window</td>
        <td><kbd>F1</kbd></td>
        <td></td>
      </tr>
-->
        <tr>
          <td><b>Keyboard Shortcuts</b></td>
          <td><kbd>Ctrl</kbd> <kbd>/</kbd></td>
          <td><kbd>Command &#8984;</kbd> <kbd>/</kbd></td>
        </tr>
      </tbody>
    </table>

  </div>
</template>
<script>
export default {
  name: 'Keyboardhelp'
}
</script>
<style scoped>
@import '~components-font-awesome/css/fontawesome-all.min.css'
</style>
<style lang="styl" scoped>
@import '~static/css/keyboard-help'
</style>
