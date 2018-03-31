Feature: Invoke a menu command using keyboard shortcut
  As a Data Packager or Data Consumer  
  I want to invoke a menu command using a keyboard shortcut  
  So that I can quickly do my work  

  RULES
  =====

  - Some menu items and their shortcuts are required by the operating system e.g. Services on macOS
  - Some menu items have different names and shortcuts on different operating systems e.g. Preferences on macOS is called Settings on Windows.

  Scenario Outline: Use Keyboard Shortcut
     Given Data Curator is open in an <operating system>
     When I use a <operating system> keyboard <shortcut>
     Then the <command> should be invoked

    Examples:
      | command                     | windows shortcut      | linux shortcut        | macOS shortcut          |
      | Preferences                 |                       |                       | command + ,             |
      | Settings                    |                       |                       |                         |
      | Quit                        | alt + F4              |                       | command + Q             |
      | Hide Data Curator           |                       |                       | command + H             |
      | Hide Others                 |                       |                       | command + option + H    |
      | New                         | control + N           | control + N           | command + N             |
      | Open Comma Separated        | control + O           | control + O           | command + O             |
      | Open Data Package           | control + shift + P   | control + shift + P   | command + shift + P     |
      | Save                        | control + S           | control + S           | command + S             |
      | Save As                     |                       |                       | command + shift + S     |
      | Close Tab                   |                       |                       | command + W             |
      | Undo                        | control + Z           | control + Z           | command + Z             |
      | Redo                        | control + Y           | control + Y           | command + Y             |
      | Cut                         | control + X           | control + X           | command + X             |
      | Copy                        | control + C           | control + C           | command + C             |
      | Paste                       | control + V           | control + V           | command + V             |
      | Insert Row Above            | control + I           | control + I           | command + I             |
      | Insert Row Below            | control + J           | control + J           | command + J             |
      | Insert Column Before        | control + K           | control + K           | command + K             |
      | Insert Column After         | control + L           | control + L           | command + L             |
      | Start Dictation             |                       |                       | fn fn                   |
      | Emoji and Symbols           |                       |                       | command + ctrl + space  |
      | Header Row                  | control + shift + H   | control + shift + H   | command + shift + H     |
      | Guess Column Properties     | control + shift + G   | control + shift + G   | command + shift + G     |
      | Set Column Properties       | control + shift + C   | control + shift + C   | command + shift + C     |
      | Set Table Properties        | control + shift + T   | control + shift + T   | command + shift + T     |
      | Set Provenance Information  | control + shift + P   | control + shift + P   | command + shift + P     |
      | Set Data Package Properties | control + shift + D   | control + shift + D   | command + shift + D     |
      | Validate Table              | control + shift + V   | control + shift + V   | command + shift + V     |
      | Export Data Package         | control + shift + X   | control + shift + X   | command + shift + X     |
      | Minimise                    |                       |                       | command + M             |
      | Show Next Tab               | control + tab         | control + tab         | command + tab           |
      | Show Previous Tab           | control + shift + tab | control + shift + tab | command + shift + tab   |
      | Keyboard Shortcuts          | control + /           | control + /           | command + /             |
