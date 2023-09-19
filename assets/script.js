document.addEventListener("DOMContentLoaded", function () {


    function Array() {
        tasksTodayArray = tasksToday.children;
        tasksTomorrowArray = tasksTomorrow.children;
        doinArray = doin.children;
        unfulfilledArray = unfulfilled.children;
        taskDeleteArray = [];
        
        for (let i = 0; i < tasksTodayArray.length; i++) {
            taskDeleteArray.push(tasksTodayArray[i].children[2]);                           
        }
        for (let i = 0; i < tasksTomorrowArray.length; i++) {
            taskDeleteArray.push(tasksTomorrowArray[i].children[2]);
        }
        
        for (let i = 0; i < unfulfilledArray.length; i++) {
            taskDeleteArray.push(unfulfilledArray[i].children[2]);                           
        }

    }

    function GetTaskArray() {
        if (localStorage.length >= 0) {
            for (let i = 0; i < localStorage.length; i++) {
                taskArray[i] = JSON.parse(localStorage.getItem(`task${i}`));
            }
        }
    }

    function PostTaskArray() {
        localStorage.clear();
        for (let i = 0; i < taskArray.length; i++) {
            localStorage.setItem(`task${i}`, JSON.stringify(taskArray[i]));
        }

    }

    function AddWindow() {
        if (!addTask) {
            ThingToDoForm.style.display = "block";
            ThingToDo.style.transform = 'rotate(45deg)';
            addTask = true;
        } else {
            ThingToDoForm.style.display = "none";
            ThingToDo.style.transform = 'rotate(0deg)';
            addTask = false;
        }
    }

    function AddTask() {

        let task = {
            title: title.value,
            description: description.value,
            date: date.value

        };

        taskArray.push(task);
        PostTaskArray();
    }

    function NewTask(title, description, date) {
        let counter = tasksToday.children.length + tasksTomorrow.children.length + doin.children.length;
        let el = `
        <div class="task cursor" data-id="${counter}">
            <div class="tasks_text" data-id="${counter}">
                <p class="tasks_title" data-id="${counter}">${title}</p>
                <p class="tasks_description" data-id="${counter}">${description}</p>
            </div>
            <p class="tasks_date" data-id="${counter}">${date}</p>
             <p class="tasks_delete cursor" data-id="${counter}" data-check="false">+</p>
            <div class="done" style="display:none"><p class="cursor" data-check="false">Отметить выполненной</p></div>
        </div>`;

        if (date == "Сегодня") {
            tasksToday.innerHTML += el;
        } else if (date == "Завтра") {
            tasksTomorrow.innerHTML += el;
        } else if (date == "Выполнено") {
            doin.innerHTML += el;
        } else if (date == "Не выполнено") {
            unfulfilled.innerHTML += el;
        } 

    }
    function Title(array, title){
        if (array.length == 0) {
            title.style.display = 'none';
        } else {
            title.style.display = 'block';
        }
    }
    
    function ShowTask() {
        tasksToday.innerHTML = '';
        tasksTomorrow.innerHTML = '';
        doin.innerHTML = '';
        unfulfilled.innerHTML = '';
        
        if (taskArray.length != 0) {
            for (let i = 0; i < taskArray.length; i++) {
                NewTask(taskArray[i]['title'], taskArray[i]['description'], taskArray[i]['date']);
            }
        }

        Array();
               
        Title(unfulfilledArray, unfulfilledTitle);
        Title(doinArray, doinTitle);

        for (let i = 0; i < taskDeleteArray.length; i++) {
            taskDeleteArray[i].addEventListener('click', (e) => {
                DeleteTask(e);
            });
        }

        for (let i = 0; i < doinArray.length; i++) {
            doinArray[i].addEventListener('click', (e) => {
                DeleteTask(e);
            });
        }
        

        
              for (let i = 0; i < tasksTodayArray.length; i++) {
            tasksTodayArray[i].addEventListener('click', (e) => {
                if (tasksTodayArray.length != 0) {

                    DoinShow(e, i, tasksTodayArray);
                }
            });

        }


        for (let i = 0; i < tasksTomorrowArray.length; i++) {
            tasksTomorrowArray[i].addEventListener('click', (e) => {
                if (tasksTomorrowArray.length != 0) {
                    DoinShow(e, i, tasksTomorrowArray);
                }
            });

        }
     
        endEven.style.display = "none";
        selectEven.style.display = "block";
        
        endOdd.style.display = "none";
        selectOdd.style.display = "block";


    }


    function Delete(num) {
        taskArray.splice(num, 1);
        PostTaskArray();
        ShowTask();
    }

    function DeleteTask(e) {
        let num = e.target.getAttribute('data-id');
        Delete(num);
    }


    function DoinShow(e, i, array) {
        if (e.target.getAttribute('data-check') != 'false'){
        let num = e.target.getAttribute('data-id');
        if (array[i] != undefined) {
            if (array[i].children[3].style.display == 'flex') {
                array[i].children[3].style.display = "none";
            } else {
                array[i].children[3].style.display = "flex";
            }


            array[i].children[3].children[0].addEventListener('click', () => {
                Doin(num);
            });
        }
        }

    }

    function Doin(num) {
        if (taskArray[num] != undefined) {
        taskArray[num]['date'] = "Выполнено";
        PostTaskArray();
        ShowTask();
        }
    }

    function Select(array, numMod, numberArray, counterSelect) {

        if (array.length > 0) {
            let mod = numMod;
            if (counterSelect) {
                numMod = 1 - numMod;
            }
            for (let i = numMod; i < array.length; i = i + 2) {
                array[i].classList.add('task_active');
                arrayNumberSelect[numberArray].push(array[i]);
            }

            if (!(!(mod ^ counterSelect) ^ ((array.length % 2 != 0) ^ mod))) {
                counterSelect = true;
            } else {
                counterSelect = false;
            }

        }
        return counterSelect;



    }

    function EndSelect(numMod) {
        for (let i = 0; i < arrayNumberSelect[numMod].length; i++) {
            arrayNumberSelect[numMod][i].classList.remove('task_active');
        }
    }
    
    function NewDay(){
        for (let i = 0; i < taskArray.length; i++){
                if (taskArray[i]['date'] == "Сегодня"){
                    taskArray[i]['date'] = "Не выполнено"
                } else if (taskArray[i]['date'] == "Завтра"){
                    taskArray[i]['date'] = "Сегодня"
                } 
        }
        
        PostTaskArray();
        
        ShowTask();
    }

    var addTask = false;
    var ThingToDo = document.getElementById('ThingToDo');
    var ThingToDoForm = document.getElementById('ThingToDoForm');

    var title = document.getElementById('title');
    var date = document.getElementById('date');
    var description = document.getElementById('description');
    var submit = document.getElementById('submit');

    var tasksToday = document.getElementById('tasksToday');
    var tasksTomorrow = document.getElementById('tasksTomorrow');
    var doin = document.getElementById('doin');
    var doinTitle = document.getElementById('doinTitle');
    var firstTask = document.getElementById('firstTask');
    var lastTask = document.getElementById('lastTask');
    var clear = document.getElementById('clear');
    var unfulfilled = document.getElementById('unfulfilled');
    var unfulfilledTitle = document.getElementById('unfulfilledTitle');
    var newDay = document.getElementById('newDay');

    var endEven = document.getElementById('endEven');
    var endOdd = document.getElementById('endOdd');
    var selectEven = document.getElementById('selectEven');
    var selectOdd = document.getElementById('selectOdd');
    var tasksTodayArray, tasksTomorrowArray, taskDeleteArray, doinArray, unfulfilledArray;

    var arrayNumberSelect = [];
    arrayNumberSelect[0] = [];
    arrayNumberSelect[1] = [];
    var taskArray = [];
    var counterSelect = true;


    GetTaskArray();


    if (typeof ThingToDo == 'object') {
        ThingToDo.addEventListener('click', AddWindow);
    };
    
     if (typeof newDay == 'object') {
        newDay.addEventListener('click', NewDay);
    };


    if (typeof submit == 'object') {
        submit.addEventListener('click', AddTask);
        submit.addEventListener('click', ShowTask);
    };

    if (typeof firstTask == 'object') {
        firstTask.addEventListener('click', () => {
            Delete(0);
        });
    };


    if (typeof lastTask == 'object') {
        lastTask.addEventListener('click', () => {
            let num = taskArray.length - 1;
            Delete(num);
        });
    };


    if (typeof clear == 'object') {
        clear.addEventListener('click', () => {
            taskArray = [];
            ShowTask();
        });
    };

    if (typeof selectEven == 'object') {
        selectEven.addEventListener('click', () => {
            selectEven.style.display = "none";
            endEven.style.display = "block";

            counterSelect = Select(tasksTodayArray, 0, 0, counterSelect);
            counterSelect = Select(tasksTomorrowArray, 0, 0, counterSelect);
            counterSelect = Select(doinArray, 0, 0, counterSelect);

            counterSelect = true;

        });
    };

    if (typeof endEven == 'object') {
        endEven.addEventListener('click', () => {
            endEven.style.display = "none";
            selectEven.style.display = "block";
            EndSelect(0);
        });
    };
    
    
      if (typeof selectOdd == 'object') {
        selectOdd.addEventListener('click', () => {
            selectOdd.style.display = "none";
            endOdd.style.display = "block";

            counterSelect = Select(tasksTodayArray, 1, 1, counterSelect);
            counterSelect = Select(tasksTomorrowArray, 1, 1, counterSelect);
            counterSelect = Select(doinArray, 1, 1, counterSelect);

            counterSelect = true;

        });
    };

    if (typeof endOdd == 'object') {
        endOdd.addEventListener('click', () => {
            endOdd.style.display = "none";
            selectOdd.style.display = "block";
            EndSelect(1);
        });
    };


    ShowTask();

    
    

});
