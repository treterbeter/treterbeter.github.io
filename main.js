document.getElementById("currentYear").innerHTML = new Date().getFullYear();

//menu:
let animationPlayState = 0;
let menuOpen = false;

function toggleMenu() {
    if(menuOpen) {
        menuOpen = false;
        document.getElementById('menu_content').style.display = "none";
        document.getElementsByTagName('main')[0].style.display = "block";
        
        if(animationPlayState === 1) {
            animationPlayState = 0;
            document.getElementsByClassName('bar1')[0].style.transform = "translate(0px, 0px)";
            document.getElementsByClassName('bar2')[0].style.opacity = "100%";
            document.getElementsByClassName('bar3')[0].style.transform = "translate(0px, 0px)";
        } else {
            animationPlayState = 3;
            document.getElementsByClassName('bar1')[0].style.transform = "rotate(0deg) translate(0px, 15px)";
            document.getElementsByClassName('bar2')[0].style.opacity = "0%";
            document.getElementsByClassName('bar3')[0].style.transform = "rotate(0deg) translate(0px, -15px)";

            setTimeout(function() {
                if(animationPlayState === 3) {
                    animationPlayState = 4;
                    document.getElementsByClassName('bar1')[0].style.transform = "translate(0px, 0px)";
                    document.getElementsByClassName('bar2')[0].style.opacity = "100%";
                    document.getElementsByClassName('bar3')[0].style.transform = "translate(0px, 0px)";
                }
            }, 150);
        }
        
    } else {
        menuOpen = true;
        document.getElementById('menu_content').style.display = "block";
        document.getElementsByTagName('main')[0].style.display = "none";

        if(animationPlayState === 3) {
            animationPlayState = 4;
            document.getElementsByClassName('bar1')[0].style.transform = "rotate(-45deg) translate(-10px, 10px)";
            document.getElementsByClassName('bar2')[0].style.opacity = "0%";
            document.getElementsByClassName('bar3')[0].style.transform = "rotate(45deg) translate(-10px, -10px)";
        } else {
            animationPlayState = 1;
            document.getElementsByClassName('bar1')[0].style.transform = "translate(0px, 15px)";
            document.getElementsByClassName('bar3')[0].style.transform = "translate(0px, -15px)";

            setTimeout(function() {
                if(animationPlayState === 1) {
                    animationPlayState = 2;
                    document.getElementsByClassName('bar1')[0].style.transform = "rotate(-45deg) translate(-10px, 10px)";
                    document.getElementsByClassName('bar2')[0].style.opacity = "0%";
                    document.getElementsByClassName('bar3')[0].style.transform = "rotate(45deg) translate(-10px, -10px)";
                }
            }, 150);
        }

    }
}

document.addEventListener("keydown", function(event) {
    //escape:
    if(event.code === "Escape") {
        if(menuOpen) {
            toggleMenu();
        } else {
            hideStreamTable();
        }
    }
});

function processNavigation() {

    let urlString = window.location.href;
    let url = new URL(urlString);
    let navValue = url.searchParams.get("nav");

    let mainElem = document.getElementsByTagName('main')[0];
    switch(navValue) {
        case "teamGenerator":
            mainElem.innerHTML = '<div id="loading">Loading...</div>';
            fetch('teamGenerator-test.html').then(response => response.text())
            .then(text => {
                mainElem.innerHTML = text
                let myScript = document.createElement("script");
                myScript.setAttribute("src", "teamGenerator.js");
                document.body.appendChild(myScript);
            })
            .catch(err => {
                console.log(err);
                mainElem.innerHTML = '<object data="teamGenerator-test.html" type="text/html"></object>';
            });
            break;
    }

}
processNavigation();

/*function loadFile(file) {

    let xhr = new XMLHttpRequest();
    xhr.open('GET', file, true);
    console.log("test1");
    xhr.onreadystatechange = function() {
        if(this.readyState !== 4) return;
        if(this.status !== 200 || this.status !== 0) return;
        document.getElementsByTagName('main')[0].innerHTML = '<object data="teamGenerator-test.html"></object>';
    };
    xhr.send();

}*/

