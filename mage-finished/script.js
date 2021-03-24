const navLinks = document.querySelectorAll('.nav-btn'); // Array of nav links
const sections = document.querySelectorAll('section'); // Aray of page sections

function changeActiveLink(newActive) {
    navLinks.forEach(btn => {
        // Goes through all the nav links
        if (btn == newActive) {
            // When the current link is the clicked one, it makes it active
            btn.classList.add('active');
        }
        else {
            // Otherwise it removes the active class
            btn.classList.remove('active');
        }
    });
}

function changeActiveSection(newActive) {
    // Almost the same as the function for links
    sections.forEach(section => {
        if (newActive == ('#' + section.id)) {
            section.classList.remove('hidden');
            section.classList.add('active');
        }
        else {
            section.classList.remove('active');
            section.classList.add('hidden');
        }
    });
}

// When you click on any link in the nav, it changes it's class to active, and shows the appropriate section
navLinks.forEach(link => {
    link.onclick = event => {
        event.preventDefault();
        changeActiveLink(link);
        changeActiveSection(link.getAttribute('href'));
    };
});

// Player object
const player = {

    // Basic properties
    shadowName: '',
    player: '',
    chronicle: '',
    virtue: '',
    vice: '',
    concept: '',
    path: '',
    order: '',
    legacy: '',

    setBasicProperty(property, value) {
        this[property] = value;
        document.getElementById(`${property}-mirror`).value = value; // Mirrors the change to the uneditable clone
    },

}

function changeBoxFilling(box) {
    const src = box.getAttribute('src');
    if (src == 'icons/box-empty.png') {
        box.src = 'icons/box-bashing.png';
    }
    else if (src == 'icons/box-bashing.png') {
        box.src = 'icons/box-lethal.png';
    }
    else if (src == 'icons/box-lethal.png') {
        box.src = 'icons/box-aggravated.png';
    }
    else if (src == 'icons/box-aggravated.png') {
        box.src = 'icons/box-empty.png';
    }
}

const boxes = document.querySelectorAll('.box');
boxes.forEach(box => {
    box.onclick = () => changeBoxFilling(box);
});

// Make elements which should not be focused unfocusable
const unfocusableElements = document.querySelectorAll('.avoid-clicks');
unfocusableElements.forEach(element => {
    element.addEventListener('focus', () => element.blur());
});

basicInfoElements = ['shadow-name', 'player', 'chronicle', 'virtue', 'vice', 'concept', 'path', 'order', 'legacy']; // I'm lazy, I put it into a loop
basicInfoElements.forEach(id => {
    const element = document.getElementById(id);
    element.onchange = () => player.setBasicProperty(id, element.value);
});

function getMirrorElement(skill) {
    let mirrorElement;

    if (skill.id.includes('-mirror')) {
        const mirrorElementID = skill.id.split('-');
        mirrorElementID = mirrorElementID[0];

        mirrorElement = document.getElementById(mirrorElementID);
    }
    else {
        mirrorElement = document.getElementById(`${skill.id}-mirror`);
    }

    return mirrorElement;
}

function changeDotFilling(dot) {
    if (dot.getAttribute('src') == 'icons/dot-empty.png') {
        dot.src = 'icons/dot-full.png';
    }
    else {
        dot.src = 'icons/dot-empty.png';
    }
}

// All dots
const dots = document.querySelectorAll('.attribute-circle');
dots.forEach(dot => {
    dot.onclick = () => changeDotFilling(dot);
});

const attributeCircles = document.querySelectorAll('.skill .attribute-circles');
attributeCircles.forEach(dotsContainer => {
    const skill = dotsContainer.closest('.skill');
    const dots = dotsContainer.querySelectorAll('.attribute-circle');

    dots.forEach(dot => {
        dot.onclick = () => {
            // Fill or unfill
            changeDotFilling(dot);

            // Preserve the checkbox state
            const checkboxChecked = skill.querySelector('input[type=checkbox]').checked; 

            // Mirror the changes
            const mirrorElement = getMirrorElement(skill);
            mirrorElement.innerHTML = skill.innerHTML;
            mirrorElement.querySelector('input[type=checkbox]').checked = checkboxChecked;
        };
    });
});

const checkBoxes = document.querySelectorAll('input[type=checkbox]');
checkBoxes.forEach(checkbox => {
    const skill = checkbox.closest('.skill');
    checkbox.onclick = () => {

        const mirrorElement = getMirrorElement(skill);

        const mirrorCheckbox = mirrorElement.querySelector('input[type=checkbox]');
        mirrorCheckbox.checked = checkbox.checked;
    };
});

// Last section in main
const sizeSpeedChildren = document.getElementById('size_speed').querySelectorAll('.line, .box');
sizeSpeedChildren.forEach(child => {
    function mirrorChanges() {
        const mirrorElement = document.getElementById('size_speed-mirror');
        const mirroredElement = document.getElementById('size_speed');

        mirrorElement.innerHTML = mirroredElement.innerHTML;
    }
    child.addEventListener('focusout', () => mirrorChanges());
    child.addEventListener('click', () => mirrorChanges());
});

// Merits
let merits = [];
const displayMeritsLines = document.querySelector('.merits').querySelectorAll('.line');
const expandedMeritsInputs = document.querySelectorAll('.expanded-merits .card-body input[type=text]');

function syncMerits() {
    for (let i = 0; i < merits.length; i++) {
        displayMeritsLines[i].innerText = merits[i];
    }
}

expandedMeritsInputs.forEach(input => {
    input.onchange = () => {
        merits.push(input.value);
        syncMerits();
    };
});

function circlesBoxesSync(mirroredID, mirrorID) {
    const mirrored = document.getElementById(mirroredID);
    const mirror = document.getElementById(mirrorID);

    const dots = mirrored.querySelectorAll('.attribute-circle');
    const boxes = mirrored.querySelectorAll('.box');

    dots.forEach(dot => {
        dot.onclick = () => {
            changeDotFilling(dot);
            mirror.innerHTML = mirrored.innerHTML;
        };
    });

    boxes.forEach(box => {
        box.onclick = () => {
            changeBoxFilling(box);
            mirror.innerHTML = mirrored.innerHTML;
        };
    });
}

// Health and damage
circlesBoxesSync('health', 'health-mirror');

// Willpower
circlesBoxesSync('willpower', 'willpower-mirror');