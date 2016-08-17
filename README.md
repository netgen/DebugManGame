# DebugManGame
  An interactive quiz about web development technologies,
played by two teams.

  The main goal is to catch all the bugs which are hidden
under some questions, and to have higher score than the
other team. 

  Before the game begins, size of the board (number of the
questions) and quantity of each bug type are configured.

  Firstly, team chooses a cell which opens a
certain question and has 10 seconds to answer. If they 
don't answer or the answer is wrong, cell stays unmarked.
If the answer is correct, chosed cell can't be picked anymore.
If there was a bug under a question, team gets some points.

Every type of bug brings different points.
Easy question, with fly icon, are worth 2 points, medium
question, bee icon, are worth 4 points, and difficult 
questions, with ladybug icon, are worth 6 points. 
These are specified on the bottom of the game page.
Empty cell bring zero points.

Question are located in JSON file and can easily be changed.
The following example defines an easy question object
(difficulty equals 1), with an array of its records:
{ "1" : [
    {
      "question": "What is the longest river in the world?",
      "answer": "Nile",
      "difficulty": 1
    },...

  Made with web technologies (JavaScript, HTML, CSS) and
external libraries such as Handlebars, jQuery and Bootstrap.
