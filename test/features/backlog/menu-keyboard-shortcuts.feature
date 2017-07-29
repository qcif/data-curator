Feature: Initiate feature using menu keyboard shortcut
  As a Data Packager or Data Consumer
  I want to select a command using a keyboard shortcut
  So that I can initiate a command quick using the keyboard rather than using the mouse

  Some menu items are required by the operating system e.g. Services on macOS

  Some menu items have different names on different operating systems e.g. Preferences on macOS is called Settings on Windows.

  Scenario: Use Keyboard Shortcut
    Given I have opened Data Curator
    When I use a <menu shortcut>
    Then the <command> is initiated

  Examples: menu shortcut
  | command              | windows | linux | macOS                          |
  | Preferences          |         |       | command + ,                    |
  | Settings             |         |       | command + ,                    |
  | Quit                 |         |       | command + Q                    |
  | New                  |         |       | command + N                    |
  | Open Comma Separated |         |       | command + O                    |
  | Open Data Package    |         |       | shift + command + P            |
  | Save                 |         |       | command + S                    |
  | Save All             |         |       | control + option + command + S |
  | Close Tab            |         |       | command + W                    |
  | Close Window         |         |       | shift + command + ,            |
  | Print                |         |       | command + P                    |
  | Undo                 |         |       | command + Z                    |
  | Redo                 |         |       | command + Y                    |
  | Cut                  |         |       | command + X                    |
  | Copy                 |         |       | command + C                    |
  | Paste                |         |       | command + V                    |
  | Select All           |         |       | command + A                    |
  | Insert Row Above     |         |       | command + I                    |
  | Insert Row Below     |         |       | command + J                    |
  | Insert Column Before |         |       | command + K                    |
  | Insert Column After  |         |       | command + L                    |
  | Show Next Tab        |         |       | command + K                    |
  | Show Previous Tab    |         |       | command + L                    |
