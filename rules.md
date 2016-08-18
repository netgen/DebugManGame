# DebugManGame

  Before the game begins, size of the board (number of the
questions) and quantity of each bug type are configured.
Maximum size of board is 6 rows and 8 columns, meaning
48 questions.

  On 'Play' button, the game board opens and a popup 
window pops out. Popup contains four buttons ('New Game',
'Game over','Undo' and 'Change turn'). Team chooses 
a cell, which opens a certain question and the answer  
shows in operator's popup. The operator manages the 
game through it, pressing letter 'C' on the keyboard if 
the answer is correct, otherwise pressing letter 'W'. 

   When a question opens, team has 10 seconds to answer. 
 If they don't answer or the answer is wrong, cell stays 
 unmarked. If the answer is correct, chosen cell can't be 
 picked out anymore. If there was a bug under a question, 
 team gets some points.

Every type of bug brings different points.
Easy question, with fly icon, are worth 2 points, medium
question, bee icon, are worth 4 points, and difficult 
questions, with ladybug icon, are worth 6 points. 
These are specified on the bottom of the game page.
Empty cell brings no points, no matter if the answer
is correct.

Question are located in JSON file and can easily be changed.
The following example defines an easy question object
(difficulty equals 1), with an array of its records:
{ "1" : [
    {
      "question": "What is the longest river in the world?",
      "answer": "Nile",
      "difficulty": 1
    },...