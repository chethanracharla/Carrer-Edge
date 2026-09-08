function animateCounter(id, target, speed) {

    let count = 0;

    const element = document.getElementById(id);

    const interval = setInterval(() => {

        count++;

        element.innerHTML = count + "+";

        if (count >= target) {

            clearInterval(interval);

        }

    }, speed);

}

animateCounter("studentsCounter", 5000, 1);

animateCounter("companiesCounter", 300, 10);

animateCounter("placementCounter", 95, 30);

animateCounter("offersCounter", 1200, 3);