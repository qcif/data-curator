Feature: Initiate feature using menu keyboard shortcut
  As a Data Packager or Data Consumer
  I want to select a command using a keyboard shortcut
  So that I can initiate a command quick using the keyboard rather than using the mouse

  Rules
  =====

  - Some menu items are required by the operating system e.g. Services on macOS
  - Some menu items have different names on different operating systems e.g. Preferences on macOS is called Settings on Windows.

  Scenario Outline: Use Keyboard Shortcut
     Given Data Curator is open in an <operating system>
     When I use a <operating system> <shortcut>
     Then the <command> is initiated

    Examples:
      | command               | windows shortcut      | linux shortcut        | macOS shortcut          |
      | Preferences           |                       |                       | command + ,             |
      | Settings              |                       |                       |                         |
      | Quit                  | alt + F4              |                       | command + Q             |
      | Hide application name |                       |                       | command + H             |
      | Hide Others           |                       |                       | command + option + H    |
      | New                   | control + N           |                       | command + N             |
      | Open Comma Separated  | control + O           |                       | command + O             |
      | Open Data Package     | control + shift + P   |                       | command + shift + P     |
      | Save                  | control + S           |                       | command + S             |
      | Save All              |                       |                       | command + option + S    |
      | Close Tab             |                       |                       | command + W             |
      | Close Window          |                       |                       | command + shift + ,     |
      | Print                 | control + P           | control + P           | command + P             |
      | Undo                  | control + Z           | control + Z           | command + Z             |
      | Redo                  | control + Y           | control + Y           | command + Y             |
      | Cut                   | control + X           | control + X           | command + X             |
      | Copy                  | control + C           | control + C           | command + C             |
      | Paste                 | control + V           | control + V           | command + V             |
      | Select All            | control + A           | control + A           | command + A             |
      | Insert Row Above      | control + I           | control + I           | command + I             |
      | Insert Row Below      | control + J           | control + J           | command + J             |
      | Insert Column Before  | control + K           | control + K           | command + K             |
      | Insert Column After   | control + L           | control + L           | command + L             |
      | Start Dictation       |                       |                       | fn fn                   |
      | Emoji and Symbols     |                       |                       | command + shift + space |
      | Minimise              |                       |                       | command + M             |
      | Show Next Tab         | control + tab         | control + tab         | command + tab           |
      | Show Previous Tab     | control + shift + tab | control + shift + tab | command + shift + tab   |
      | Export Data Package   | control + D           | control + D           | command + D             |
      | Help                  | F1                    |                       |                         |
      | Keyboard Shortcuts    | control + /           | control + /           | command + /             |
