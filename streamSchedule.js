class Entry {

    constructor(title, game, day, startTime, durationInMin, showEndTime, color) {
        this.title = title;
        this.game = game;
        this.day = Math.max(Math.min(day, 6), 0);
        this.startTime = startTime;
        this.durationInMin = Math.max(durationInMin, 0);
        this.color = color;
        this.showEndTime = showEndTime;
    }

    get startHours() {
        return this.startTime.hours;
    }
    get startMinutes() {
        return this.startTime.minutes;
    }

    get endTime() {
        let hours = this.startHours + Math.floor((this.durationInMin + this.startMinutes) / 60);
        let mins = (this.durationInMin + this.startMinutes) % 60;
        return new EntryTime(hours, mins);
    }
    get endTimeAsDouble() {
        return this.endTime.hours + (this.endTime.minutes / 60.0);
    }

    get widthInPercent() {
        let width = this.durationInMin / ((Math.ceil(this.endTimeAsDouble) - this.startHours) * 60);
        return Math.max(Math.round(width * 100), 20);
    }
    get marginLeft() {
        let margin = this.startMinutes / ((Math.ceil(this.endTimeAsDouble) - this.startHours) * 60);
        return Math.min(Math.round(margin * 100), 80);
    }

}

class EntryTime {

    constructor(hours, minutes) {
        this.hours = Math.max(Math.min(hours, 23), 0);
        this.minutes = Math.max(Math.min(minutes, 59), 0);
    }

    get asString() {
        return this.hours.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false}) + ":" + this.minutes.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false});
    }

}

class EntryColor {

    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    get asString() {
        return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
    }

}

const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const colors = {
    red: "rgb(240, 42, 69)",
    orange: "rgb(251, 154, 54)",
    purple: "rgb(200, 52, 242)",
    pink: "rgb(241, 56, 200)",
    blue: "rgb(49, 128, 228)",
    green: "rgb(16, 235, 164)",
    gray: "rgb(100, 100, 100)"
}

let entries = new Array();
//entries.push(new Entry("3h lang (1-4)", "reinballern", 1, new EntryTime(1, 00), 180));
/*entries.push(new Entry("0h lang (19-20)", "reinballern", 1, new EntryTime(19, 00), 60));
entries.push(new Entry("1h lang (20-21)", "reinballern", 1, new EntryTime(20, 00), 60));
entries.push(new Entry("1.1h lang (21-22:06)", "reinballern", 0, new EntryTime(21, 00), 66));
entries.push(new Entry("2h lang (19-21)", "reinballern", 7, new EntryTime(19, 00), 120));
entries.push(new Entry("2h lang (20:59-22:59)", "reinballern", 4, new EntryTime(20, 69), 120));
entries.push(new Entry("1h lang (18-19)", "reinballern", 4, new EntryTime(18, 00), 60));
entries.push(new Entry("61min (22-23:01) longggg wwwwwwwwwwwwwwwwwwwwwwww wwwwwwwwwwwwwwwwwww wwwwwwwwwwwwwwww aaaaaaaaaaaaa", "reinballern", 3, new EntryTime(22, 00), 61));
entries.push(new Entry("30 min (18:59-19:29) kurzer stream", "reinballern", 2, new EntryTime(18, 59), 30));*/
//entries.push(new Entry("LOL - hyper entainment", "reinballern", 2, new EntryTime(15, 00), 600));
entries.push(new Entry("Den Weg der Champions betreten oder auch nicht", "Rocket League", 1, new EntryTime(19, 0), 150, true, colors.blue));
entries.push(new Entry("Fullsquad Mittwoch", "Fortnite", 2, new EntryTime(19, 0), 120, true, colors.purple));
entries.push(new Entry("LOL - Leid oder Liebe", "League of Legends", 3, new EntryTime(15, 0), 180, false, colors.red));
entries.push(new Entry("FIFA gamen ohne Sinn und Verstand", "FIFA 22", 6, new EntryTime(17, 0), 150, false, colors.orange));

function createTable() {

    let overlay = document.getElementById("overlay");
    overlay.addEventListener("click", function(event) {
        hideStreamTable();
    });

    let table = document.getElementById("stream_table");
    let dayTable = document.getElementById("day_table");
    table.innerHTML = "";
    dayTable.innerHTML = "";

    //get min and max time:
    let minTime = entries.reduce((prev, curr) => {
        return prev.startHours < curr.startHours ? prev : curr;
    }).startHours;
    let maxTime = entries.reduce((prev, curr) => {
        return prev.endTimeAsDouble > curr.endTimeAsDouble ? prev : curr;
    }).endTimeAsDouble;
    maxTime = Math.min(Math.ceil(maxTime), 23);

    //create table:

    //table head:
    let dayHead = document.createElement("tr");
    let dayElem = document.createElement("th");
    let dayElemDiv = document.createElement("div");
    dayElemDiv.innerHTML = "Zeit";
    dayElem.appendChild(dayElemDiv);
    dayHead.appendChild(dayElem);
    dayTable.appendChild(dayHead);

    let tableHead = document.createElement("tr");

    for(let i = minTime; i <= maxTime; i++) {
        let timeHeadElem = document.createElement("th");
        timeHeadElem.innerHTML = i.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false}) + ":00";

        tableHead.appendChild(timeHeadElem);
    }

    table.appendChild(tableHead);

    //table body:
    for(let i = 0; i < 7; i++) {

        let tableRow = document.createElement("tr");

        let entriesToday = entries.filter((entry) => {
            return entry.day == i;
        });
        let entriesTodaySorted = [];
        for(let j = 0; j < entriesToday.length; j++) {
            entriesTodaySorted[entriesToday[j].startHours] = entriesToday[j];
        }

        //days:
        let dayRow = document.createElement("tr");
        let dayElem = document.createElement("td");
        let dayElemDiv = document.createElement("div");
        if(entriesToday.length > 0) {
            dayElemDiv.classList.add("filledHeight");
        } else {
            dayElemDiv.classList.add("emptyHeight");
        }
        dayElemDiv.innerHTML = weekDays[i];
        dayElem.appendChild(dayElemDiv);
        dayRow.appendChild(dayElem);
        dayTable.appendChild(dayRow);

        //entries:
        for(let j = minTime; j <= maxTime; j++) {
            
            let tableElem = document.createElement("td");
            
            let entry = entriesTodaySorted[j];

            if(entry != null) {

                let tableElemDiv = document.createElement("div");
                tableElemDiv.classList.add("filledHeight", "stream_entry");
                tableElemDiv.style.width = entry.widthInPercent + "%";
                tableElemDiv.style.marginLeft = entry.marginLeft + "%";
                tableElemDiv.style.setProperty("--entry-color", entry.color);

                //tableElemDiv.innerHTML = entriesTodaySorted[j].title;
                //tableElemDiv.style.backgroundColor = "red";
                let title = document.createElement("div");
                title.classList.add("entry_title");
                title.innerHTML = entry.title;

                let time = document.createElement("div");
                time.classList.add("entry_time");
                if(entry.showEndTime) {
                    time.innerHTML = '<i class="far fa-clock"></i> ' + entry.startTime.asString + " - " + entry.endTime.asString + " &bull; " + entry.game;
                } else {
                    time.innerHTML = '<i class="far fa-clock"></i> ab ' + entry.startTime.asString + " &bull; " + entry.game;
                }

                tableElemDiv.appendChild(title);
                tableElemDiv.appendChild(time);
                tableElem.appendChild(tableElemDiv);

                let endHour = Math.ceil(entry.endTimeAsDouble);
                if(endHour > entry.startHours) {
                    let span = endHour - entry.startHours;
                    j += (span - 1);
                    tableElem.setAttribute("colspan", span);
                }
            } else {

                let tableElemDiv = document.createElement("div");
                tableElemDiv.classList.add("emptyHeight");
                tableElem.appendChild(tableElemDiv);
                
            }
            
            tableRow.appendChild(tableElem);

        }
        
        table.appendChild(tableRow);

    }

}

function showStreamTable() {
    let container = document.getElementById("schedule_container");
    let overlay = document.getElementById("overlay");
    overlay.style.display = "block";
    container.style.display = "block";
}
function hideStreamTable() {
    let container = document.getElementById("schedule_container");
    let overlay = document.getElementById("overlay");
    container.style.display = "none";
    overlay.style.display = "none";
}

createTable();
//showStreamTable();

let streamSchedule = document.getElementById("stream_schedule");
streamSchedule.addEventListener("scroll", function(event) {

    let scrollAmount = streamSchedule.scrollLeft;

    let scheduleDays = document.getElementById("day_table");
    if(scrollAmount > 10) {
        scheduleDays.style.boxShadow = "-5px 0px 25px 5px rgba(0, 0, 0, 0.3)";
    } else if(scrollAmount > 1) {
        let blur = Math.round(scrollAmount * 2.5);
        scheduleDays.style.boxShadow = "-5px 0px " + blur + "px 5px rgba(0, 0, 0, 0.3)";
    } else {
        scheduleDays.style.boxShadow = "none";
    }

});
