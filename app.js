const express = require("express");
const path = require("path");
const db = require("./config/db");
const session = require("express-session");
const { error } = require("console");

const app = express();
const PORT = 3000;


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(express.urlencoded({ extended: true }));

app.use(session({

    secret: "placement-secret",

    resave: false,

    saveUninitialized: false,

    cookie: {
        maxAge: 1000 * 60 * 60
    }

}));

app.use(express.static(path.join(__dirname, "public")));


// ======================================================
// HOME PAGE
// ======================================================

app.get("/", (request, response) => {

    response.sendFile(
        path.join(__dirname, "views", "index.html")
    );

});


// ======================================================
//                  STUDENT MODULE
// ======================================================


// ================= STUDENT REGISTER GET =================

app.get("/student/register", (request, response) => {

    response.sendFile(
        path.join(
            __dirname,
            "views",
            "student",
            "register.html"
        )
    );

});


// ================= STUDENT REGISTER POST =================

app.post("/student/register", (request, response) => {

    const {
        full_name,
        email,
        phone,
        college,
        branch,
        graduation_year,
        password,
        confirm_password,
        cgpa,
        skills,
        resume
    } = request.body;


    if (password !== confirm_password) {

        return response.send("Password is not matching");

    }


    const sql = `
        INSERT INTO students
        (
            full_name,
            email,
            phone,
            college,
            branch,
            graduation_year,
            password,
            cgpa,
            skills
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;


    const VALUES = [
        full_name,
        email,
        phone,
        college,
        branch,
        graduation_year,
        password,
        cgpa,
        skills
    ];


    db.query(sql, VALUES, (error, result) => {

        if (error !== null) {

            console.log(error);

            return response.send("Database error");

        }


        console.log(result);

        response.send("Student data is inserted successfully");

    });

});


// ================= STUDENT LOGIN GET =================

app.get("/student/login", (request, response) => {

    response.sendFile(
        path.join(
            __dirname,
            "views",
            "student",
            "login.html"
        )
    );

});


// ================= STUDENT LOGIN POST =================

app.post("/student/login", (request, response) => {

    const { email, password } = request.body;

    const sql = `
        SELECT *
        FROM students
        WHERE email = ?;
    `;

    db.query(sql, [email], (error, result) => {

        if (error) {

            console.log(error);

            return response.send("Database Error");

        }

        if (result.length === 0) {

            return response.send("Email not found");

        }

        if (password !== result[0].password) {

            return response.send("Invalid Password");

        }

        request.session.studentId = result[0].id;

        request.session.save((err) => {

            if (err) {

                console.log(err);

                return response.send("Session Error");

            }

            response.redirect("/student/dashboard");

        });

    });

});

// ================= STUDENT DASHBOARD =================

app.get("/student/dashboard", (request, response) => {

    if (request.session.studentId === undefined) {

        return response.redirect("/student/login");

    }


    response.sendFile(
        path.join(
            __dirname,
            "views",
            "student",
            "dashboard.html"
        )
    );

});
//======================= student profile===============
app.get("/student/profile",(request,response)=>{
    if(request.session.studentId===undefined){
        return response.redirect("/student/login")
    }
    const studentId= request.session.studentId
    const sql=` select * from students 
                where id=?;`;
    db.query(sql,[studentId],(error,result)=>{
        if(error!==null){
            console.log(error);
            return response.send("database error")
        }
        if(result.length===0){
            return response.send("the student details is not found")
        }
        const student=result[0]
        response.send(`
                    <!DOCTYPE html>

                    <html lang="en">

                    <head>

                    <meta charset="UTF-8">

                    <meta name="viewport" content="width=device-width, initial-scale=1.0">

                    <title>My Profile</title>

                    <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                    rel="stylesheet">

                    </head>

                    <body class="bg-light">

                    <div class="container py-5">

                    <h1 class="text-center mb-5">
                    My Profile
                    </h1>

                    <div class="card shadow p-4">

                    <h3 class="mb-4">

                    👤 ${student.full_name}

                    </h3>

                    <p>

                    <strong>Email :</strong>

                    ${student.email}

                    </p>

                    <p>

                    <strong>Phone :</strong>

                    ${student.phone}

                    </p>

                    <p>

                    <strong>College :</strong>

                    ${student.college}

                    </p>

                    <p>

                    <strong>Branch :</strong>

                    ${student.branch}

                    </p>

                    <p>

                    <strong>Graduation Year :</strong>

                    ${student.graduation_year}

                    </p>

                    <p>

                    <strong>CGPA :</strong>

                    ${student.cgpa}

                    </p>

                    <p>

                    <strong>Skills :</strong>

                    ${student.skills}

                    </p>

                    <p>

                    <strong>Resume :</strong>

                    ${student.resume || "Not Uploaded"}

                    </p>

                    <div class="mt-4">

                    <a
                    href="/student/profile/edit"
                    class="btn btn-warning">

                    Edit Profile

                    </a>

                    <a
                    href="/student/dashboard"
                    class="btn btn-primary ms-2">

                    Back

                    </a>

                    </div>

                    </div>

                    </div>

                    </body>

                    </html>
                    `);
                        })
                    })
//======================= STUDENT PROFILE EDIT GET =======================

app.get("/student/profile/edit", (request, response) => {

    // Check Student Login
    if (request.session.studentId === undefined) {

        return response.redirect("/student/login");

    }

    // Get Logged-in Student ID
    const studentId = request.session.studentId;

    // SQL Query
    const sql = `
        SELECT *
        FROM students
        WHERE id = ?;
    `;

    db.query(sql, [studentId], (error, result) => {

        if (error !== null) {

            console.log(error);

            return response.send("Database Error");

        }

        if (result.length === 0) {

            return response.send("Student Not Found");

        }

        const student = result[0];

        response.send(`

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Edit Profile</title>

<link
href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
rel="stylesheet">

</head>

<body class="bg-light">

<div class="container py-5">

    <h1 class="text-center mb-5">

        Edit Profile

    </h1>

    <div class="card shadow p-4">

        <form action="/student/profile/edit" method="POST">

            <div class="mb-3">

                <label class="form-label">

                    Full Name

                </label>

                <input
                    type="text"
                    name="full_name"
                    class="form-control"
                    value="${student.full_name}"
                    required>

            </div>

            <div class="mb-3">

                <label class="form-label">

                    Phone

                </label>

                <input
                    type="text"
                    name="phone"
                    class="form-control"
                    value="${student.phone}"
                    required>

            </div>

            <div class="mb-3">

                <label class="form-label">

                    College

                </label>

                <input
                    type="text"
                    name="college"
                    class="form-control"
                    value="${student.college}"
                    required>

            </div>

            <div class="mb-3">

                <label class="form-label">

                    CGPA

                </label>

                <input
                    type="number"
                    step="0.01"
                    name="cgpa"
                    class="form-control"
                    value="${student.cgpa}"
                    required>

            </div>

            <div class="mb-3">

                <label class="form-label">

                    Skills

                </label>

                <textarea
                    name="skills"
                    class="form-control"
                    rows="4">${student.skills}</textarea>

            </div>

            <button
                type="submit"
                class="btn btn-success">

                Update Profile

            </button>

            <a
                href="/student/profile"
                class="btn btn-secondary ms-2">

                Cancel

            </a>

        </form>

    </div>

</div>

</body>

</html>

        `);

    });

}); 
//=========================student profile updating the details inthe database using post=========================
app.post("/student/profile/edit",(request,response)=>{
    if(request.session.studentId===undefined){
        return response.redirect("/student/login")
    }
    const studentId=request.session.studentId;
    const {
        full_name,
        phone,
        college,
        cgpa,
        skills
    
    }=request.body
    const sql=`
    update students 
    set 
    full_name=?,
    phone=?,
    college=?,
    cgpa=?,
    skills=?
    where id=?;
    `
    const values=[
        full_name,
        phone,
        college,
        cgpa,
        skills,
        studentId

    ]
    db.query(sql,values,(error,result)=>{
        if(error!==null){
        console.log(error)
        return response.send("database error")
        }
        console.log(result)
        return response.redirect("/student/profile")
    })

})

/// ================= STUDENT VIEW JOBS =================


app.get("/student/jobs", (request, response) => {

    // Check student login
    if (request.session.studentId === undefined) {

        return response.redirect("/student/login");

    }

    // Logged-in student ID
    const studentId = request.session.studentId;

    // Get student details
    const studentSql = `
        SELECT *
        FROM students
        WHERE id = ?;
    `;

    db.query(studentSql, [studentId], (error, studentResult) => {

        if (error) {

            console.log(error);

            return response.send("Student Database Error");

        }

        if (studentResult.length === 0) {

            return response.send("Student Not Found");

        }

        const student = studentResult[0];

        // Get all jobs
        const jobsSql = `
            SELECT *
            FROM jobs;
        `;

        db.query(jobsSql, (jobsError, jobsResult) => {

            if (jobsError) {

                console.log(jobsError);

                return response.send("Jobs Database Error");

            }

            const eligibleJobs = [];

            jobsResult.forEach((job) => {

                const isCgpaEligible =
                    Number(student.cgpa) >= Number(job.min_cgpa);

                const isBranchEligible =
                    student.branch.trim().toLowerCase() ===
                    job.branch.trim().toLowerCase();

                const isYearEligible =
                    student.graduation_year ===
                    job.graduation_year;

                const isEligible =
                    isCgpaEligible &&
                    isBranchEligible &&
                    isYearEligible;

                if (isEligible) {

                    eligibleJobs.push(job);

                }

            });

            let jobsHTML = "";

            if (eligibleJobs.length === 0) {

                jobsHTML = `

                    <div class="col-12">

                        <div class="alert alert-warning text-center">

                            <h4>No Eligible Jobs Found</h4>

                            <p>
                                You are currently not eligible for any jobs.
                            </p>

                        </div>

                    </div>

                `;

            }

            eligibleJobs.forEach((job) => {

                jobsHTML += `

                    <div class="col-md-4 mb-4">

                        <div class="card shadow h-100">

                            <div class="card-body">

                                <h3 class="text-primary">
                                    ${job.company_name}
                                </h3>

                                <h5>
                                    ${job.job_title}
                                </h5>

                                <p>📍 ${job.location}</p>

                                <p>💰 ${job.salary}</p>

                                <p>
                                    🎓 Minimum CGPA :
                                    ${job.min_cgpa}
                                </p>

                                <p>
                                    💻 Branch :
                                    ${job.branch}
                                </p>

                                <p>
                                    📅 Graduation Year :
                                    ${job.graduation_year}
                                </p>

                                <p>
                                    ${job.description}
                                </p>

                                <a
                                    href="/student/jobs/apply/${job.id}"
                                    class="btn btn-success w-100"
                                >
                                    Apply Now
                                </a>

                            </div>

                        </div>

                    </div>

                `;

            });

            response.send(`

                <!DOCTYPE html>

                <html lang="en">

                <head>

                    <meta charset="UTF-8">

                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    >

                    <title>Eligible Jobs</title>

                    <link
                        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                        rel="stylesheet"
                    >

                </head>

                <body class="bg-light">

                    <div class="container py-5">

                        <h1 class="text-center mb-5">

                            Eligible Jobs

                        </h1>

                        <div class="row">

                            ${jobsHTML}

                        </div>

                        <div class="text-center mt-4">

                            <a
                                href="/student/dashboard"
                                class="btn btn-primary"
                            >

                                Back to Dashboard

                            </a>

                        </div>

                    </div>

                </body>

                </html>

            `);

        });

    });

});

//================== Student Logout ==================

app.get("/student/logout", (request, response) => {

    request.session.destroy((error) => {

        if (error) {

            console.log(error);

            return response.send("Logout Failed");

        }

        response.redirect("/student/login");

    });

});
//==================when the student click apply the data will move to the sql================

app.get("/student/jobs/apply/:jobID", (request, response) => {

    // Check student login
    if (request.session.studentId === undefined) {

        return response.redirect("/student/login");

    }

    // Student ID from Session
    const studentId = request.session.studentId;

    // Job ID from URL
    const jobID = request.params.jobID;

    // Check whether student already applied
    const checkSql = `
        SELECT *
        FROM applications
        WHERE student_id = ?
        AND job_id = ?
    `;

    db.query(checkSql, [studentId, jobID], (checkError, checkResult) => {

        if (checkError) {

            console.log(checkError);

            return response.send("Database Error");

        }

        // Already applied
        if (checkResult.length > 0) {

            return response.send("You have already applied for this job.");

        }

        // Insert application
        const insertSql = `
            INSERT INTO applications
            (
                student_id,
                job_id,
                application_date,
                status
            )
            VALUES (?, ?, CURDATE(), ?)
        `;

        const values = [

            studentId,

            jobID,

            "Pending"

        ];

        db.query(insertSql, values, (insertError, insertResult) => {

            if (insertError) {

                console.log(insertError);

                return response.send("Database Error");

            }

            console.log(insertResult);

            return response.send("Application Submitted Successfully");

        });

    });

});
//===============================what are the jobs the student is applied that will be showwn=============================

app.get("/student/applications", (request, response) => {

    // Check Student Login
    if (request.session.studentId === undefined) {

        return response.redirect("/student/login");

    }

    // Get Logged-in Student ID
    const studentId = request.session.studentId;

    // SQL Query
    const sql = `
        SELECT
            jobs.company_name,
            jobs.job_title,
            applications.application_date,
            applications.status
        FROM applications
        JOIN jobs
        ON applications.job_id = jobs.id
        WHERE applications.student_id = ?
    `;

    db.query(sql, [studentId], (error, result) => {

        if (error !== null) {

            console.log(error);

            return response.send("Database Error");

        }

        // Store HTML
        let applicationsHTML = "";

        // Loop through every application
        result.forEach((application) => {

            applicationsHTML += `

                <div class="col-md-4 mb-4">

                    <div class="card shadow h-100">

                        <div class="card-body">

                            <h3 class="text-primary">

                                ${application.company_name}

                            </h3>

                            <h5>

                                ${application.job_title}

                            </h5>

                            <p>

                                📅 Applied Date :
                                ${application.application_date}

                            </p>

                            <p>

                                📌 Status :
                                ${application.status}

                            </p>

                        </div>

                    </div>

                </div>

            `;

        });

        // If no applications found
        if (result.length === 0) {

            applicationsHTML = `

                <div class="col-12">

                    <div class="alert alert-warning text-center">

                        You have not applied for any jobs yet.

                    </div>

                </div>

            `;

        }

        // Send HTML Page
        response.send(`

            <!DOCTYPE html>

            <html lang="en">

            <head>

                <meta charset="UTF-8">

                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                >

                <title>

                    My Applications

                </title>

                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                >

            </head>

            <body class="bg-light">

                <div class="container py-5">

                    <h1 class="text-center mb-5">

                        My Applications

                    </h1>

                    <div class="row">

                        ${applicationsHTML}

                    </div>

                    <div class="text-center mt-4">

                        <a
                            href="/student/dashboard"
                            class="btn btn-primary"
                        >

                            Back to Dashboard

                        </a>

                    </div>

                </div>

            </body>

            </html>

        `);

    });

});
//================== ADMIN REGISTER GET ==================

app.get("/admin/register", (request, response) => {

    response.sendFile(

        path.join(

            __dirname,

            "views",

            "admin",

            "register.html"

        )

    );

});

// ================= ADMIN REGISTER POST =================

app.post("/admin/register", (request, response) => {

    const {
        email,
        password,
        confirm_password
    } = request.body;


    if (password !== confirm_password) {

        return response.send(
            "Password is not matching"
        );

    }


    const sql = `
        INSERT INTO admins
        (
            email,
            password
        )
        VALUES (?, ?)
    `;


    const VALUES = [
        email,
        password
    ];


    db.query(sql, VALUES, (error, result) => {

        if (error !== null) {

            console.log(error);

            return response.send("Database error");

        }


        console.log(result);


        response.send(
            "Admin registration successful"
        );

    });

});


// ================= ADMIN LOGIN GET =================

app.get("/admin/login", (request, response) => {

    response.sendFile(
        path.join(
            __dirname,
            "views",
            "admin",
            "login.html"
        )
    );

});


// ================= ADMIN LOGIN POST =================

app.post("/admin/login", (request, response) => {

    const {
        email,
        password
    } = request.body;


    const sql = `
        SELECT * FROM admins
        WHERE email = ?
    `;


    db.query(sql, [email], (error, result) => {

        if (error !== null) {

            console.log(error);

            return response.send("Database error");

        }


        if (result.length === 0) {

            return response.send(
                "The email does not exist"
            );

        }


        if (password !== result[0].password) {

            return response.send(
                "Password is not matching"
            );

        }


        request.session.adminId = result[0].id;


        response.redirect("/admin/dashboard");

    });

});


// ================= ADMIN DASHBOARD =================

app.get("/admin/dashboard", (request, response) => {

    if (request.session.adminId === undefined) {

        return response.redirect("/admin/login");

    }


    const sql = `
    SELECT
    (SELECT COUNT(*) FROM students) AS totalStudents,
    (SELECT COUNT(*) FROM jobs) AS totalJobs,
    (SELECT COUNT(*) FROM applications) AS totalApplications,
    (SELECT COUNT(*) FROM applications WHERE status='Approved') AS approved,
    (SELECT COUNT(*) FROM applications WHERE status='Rejected') AS rejected,
    (SELECT COUNT(*) FROM applications WHERE status='Pending') AS pending;
`;
    db.query(sql, (error, result) => {

    if (error !== null) {

        console.log(error);

        return response.send("Database Error");

    }

    

    const statistics = result[0];

    response.send(`
        <!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>Admin Dashboard</title>

    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css"
        rel="stylesheet">

    <link rel="stylesheet" href="/css/style.css">

</head>

<body class="bg-light">

    <!-- ================= NAVBAR ================= -->

    <nav class="navbar navbar-dark bg-dark">

        <div class="container">

            <a class="navbar-brand fw-bold" href="/admin/dashboard">
                Placement Admin
            </a>

            <a href="/admin/logout"
               class="btn btn-danger">

                Logout

            </a>

        </div>

    </nav>


    <!-- ================= DASHBOARD ================= -->

    <div class="container mt-5">

        <h1 class="fw-bold">
            Admin Dashboard
        </h1>

        <p class="text-muted">
            Manage jobs and student applications.
        </p>


        <div class="row g-4">

    <!-- ADD JOB -->

    <div class="row g-4">

    <!-- Add Job Card -->
    <div class="col-md-4">
        <div class="card h-100 p-4 shadow">
            
            <div class="fs-1 mb-2">💼</div>

            <h2>Add Job</h2>

            <p>Create a new job opportunity.</p>

            <a href="/admin/jobs/add" 
               class="btn btn-primary mt-auto d-flex justify-content-center align-items-center">
                Add Job
            </a>

        </div>
    </div>


    <!-- View Jobs Card -->
    <div class="col-md-4">
        <div class="card h-100 p-4 shadow">

            <div class="fs-1 mb-2">🏢</div>

            <h2>View Jobs</h2>

            <p>View all available jobs.</p>

            <a href="/admin/jobs"
               class="btn btn-success mt-auto d-flex justify-content-center align-items-center">
                View Jobs
            </a>

        </div>
    </div>


    <!-- Applications Card -->
    <div class="col-md-4">
        <div class="card h-100 p-4 shadow">

            <div class="fs-1 mb-2">📄</div>

            <h2>Applications</h2>

            <p>View student applications.</p>

            <a href="/admin/applications"
               class="btn btn-warning mt-auto d-flex justify-content-center align-items-center">
                View Applications
            </a>

        </div>
    </div>
    <!-- ================= PLACEMENT STATISTICS ================= -->

<hr class="my-5">

<div class="container mb-5">

    <h2 class="text-center fw-bold mb-4">

        📊 Placement Statistics

    </h2>

    <div class="row g-4">

        <!-- Total Students -->
        <div class="col-md-4">

            <div class="card shadow text-center h-100">

                <div class="card-body">

                    <h5>Total Students</h5>

                    <h2 id="totalStudents">

                        ${statistics.totalStudents}

                    </h2>

                </div>

            </div>

        </div>

        <!-- Total Jobs -->
        <div class="col-md-4">

            <div class="card shadow text-center h-100">

                <div class="card-body">

                    <h5>Total Jobs</h5>

                    <h2 id="totalJobs">

                        ${statistics.totalJobs}

                    </h2>

                </div>

            </div>

        </div>

        <!-- Total Applications -->
        <div class="col-md-4">

            <div class="card shadow text-center h-100">

                <div class="card-body">

                    <h5>Total Applications</h5>

                    <h2 id="totalApplications">

                        ${statistics.totalApplications}

                    </h2>

                </div>

            </div>

        </div>

        <!-- Approved -->
        <div class="col-md-4">

            <div class="card shadow text-center border-success h-100">

                <div class="card-body">

                    <h5>Approved</h5>

                    <h2 id="approved">

                        ${statistics.approved}

                    </h2>

                </div>

            </div>

        </div>

        <!-- Rejected -->
        <div class="col-md-4">

            <div class="card shadow text-center border-danger h-100">

                <div class="card-body">

                    <h5>Rejected</h5>

                    <h2 id="rejected">

                        ${statistics.rejected}

                    </h2>

                </div>

            </div>

        </div>

        <!-- Pending -->
        <div class="col-md-4">

            <div class="card shadow text-center border-warning h-100">

                <div class="card-body">

                    <h5>Pending</h5>

                    <h2 id="pending">

                        ${statistics.pending}

                    </h2>

                </div>

            </div>

        </div>

    </div>

</div>

</div>

        </div>

    </div>

</body>

</html>
        `);

});

});


// ================= ADMIN ADD JOB GET =================

app.get("/admin/jobs/add", (request, response) => {

    if (request.session.adminId === undefined) {

        return response.redirect("/admin/login");

    }


    response.sendFile(
        path.join(
            __dirname,
            "views",
            "admin",
            "add-job.html"
        )
    );

});


// ================= ADMIN ADD JOB POST =================

app.post("/admin/jobs/add", (request, response) => {

    if (request.session.adminId === undefined) {

        return response.redirect("/admin/login");

    }


    const {
        company_name,
        job_title,
        location,
        salary,
        min_cgpa,
        branch,
        graduation_year,
        description
    } = request.body;


    const sql = `
        INSERT INTO jobs
        (
            company_name,
            job_title,
            location,
            salary,
            min_cgpa,
            branch,
            graduation_year,
            description
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;


    const VALUES = [
        company_name,
        job_title,
        location,
        salary,
        min_cgpa,
        branch,
        graduation_year,
        description
    ];


    db.query(sql, VALUES, (error, result) => {

        if (error !== null) {

            console.log(error);

            return response.send("Database error");

        }


        console.log(result);


        response.send("Job added successfully");

    });

});


// ================= ADMIN VIEW JOBS =================

app.get("/admin/jobs", (request, response) => {

    if (request.session.adminId === undefined) {

        return response.redirect("/admin/login");

    }


    const sql = `
        SELECT * FROM jobs
    `;


    db.query(sql, (error, result) => {

        if (error !== null) {

            console.log(error);

            return response.send("Database error");

        }


        let jobsHTML = "";


        result.forEach((job) => {

            jobsHTML += `

                <div class="col-md-4 mb-4">

                    <div class="card h-100 shadow p-3">

                        <div class="card-body">

                            <h3 class="card-title">
                                ${job.job_title}
                            </h3>


                            <h5 class="text-primary">
                                ${job.company_name}
                            </h5>


                            <p>
                                📍 ${job.location}
                            </p>


                            <p>
                                💰 ${job.salary}
                            </p>


                            <p>
                                🎓 Minimum CGPA:
                                ${job.min_cgpa}
                            </p>


                            <p>
                                💻 Branch:
                                ${job.branch}
                            </p>


                            <p>
                                📅 Graduation Year:
                                ${job.graduation_year}
                            </p>


                            <p>
                                ${job.description}
                            </p>

                        </div>

                    </div>

                </div>

            `;

        });


        response.send(`

            <!DOCTYPE html>

            <html lang="en">


            <head>

                <meta charset="UTF-8">


                <meta
                    name="viewport"
                    content="width=device-width,
                    initial-scale=1.0"
                >


                <title>
                    View Jobs
                </title>


                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                >

            </head>


            <body class="bg-light">


                <div class="container py-5">


                    <h1 class="text-center mb-5">

                        Available Jobs

                    </h1>


                    <div class="row">

                        ${jobsHTML}

                    </div>


                </div>


            </body>


            </html>

        `);

    });

});


//======================= Admin View Applications ==================

app.get("/admin/applications", (request, response) => {

    // Check Admin Login
    if (request.session.adminId === undefined) {

        return response.redirect("/admin/login");

    }

    // SQL Query
    const sql = `
        SELECT
            applications.id,
            students.full_name,
            jobs.company_name,
            jobs.job_title,
            applications.application_date,
            applications.status
        FROM applications
        JOIN students
        ON applications.student_id = students.id
        JOIN jobs
        ON applications.job_id = jobs.id
    `;

    db.query(sql, (error, result) => {

        if (error !== null) {

            console.log(error);

            return response.send("Database Error");

        }

        let tableRows = "";

        result.forEach((application) => {

            tableRows += `

                <tr>

                    <td>${application.id}</td>

                    <td>${application.full_name}</td>

                    <td>${application.company_name}</td>

                    <td>${application.job_title}</td>

                    <td>${application.application_date}</td>

                    <td>${application.status}</td>

                    <td>

                        <a
                            href="/admin/application/approve/${application.id}"
                            class="btn btn-success btn-sm">

                            Approve

                        </a>

                        <a
                            href="/admin/application/reject/${application.id}"
                            class="btn btn-danger btn-sm ms-2">

                            Reject

                        </a>

                    </td>

                </tr>

            `;

        });

        response.send(`

            <!DOCTYPE html>

            <html lang="en">

            <head>

                <meta charset="UTF-8">

                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                >

                <title>

                    View Applications

                </title>

                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                >

            </head>

            <body class="bg-light">

                <div class="container mt-5">

                    <h1 class="text-center mb-4">

                        Student Applications

                    </h1>

                    <table class="table table-bordered table-striped table-hover">

                        <thead class="table-dark">

                            <tr>

                                <th>ID</th>

                                <th>Student Name</th>

                                <th>Company</th>

                                <th>Job Title</th>

                                <th>Applied Date</th>

                                <th>Status</th>

                                <th>Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            ${tableRows}

                        </tbody>

                    </table>

                    <div class="text-center mt-4">

                        <a
                            href="/admin/dashboard"
                            class="btn btn-primary">

                            Back to Dashboard

                        </a>

                    </div>

                </div>

            </body>

            </html>

        `);

    });

});
//======================admin click the approve button==================================
app.get("/admin/application/approve/:id",(request,response)=>{
    if(request.session.adminId===undefined){
        return response.redirect("admin/login")
    }
    const applicationId = request.params.id;
    const sql=`update applications
                set status=?
                where id=?;`;
    db.query(sql,["Approved",applicationId],(error,result)=>{
        if(error!==null){
            console.log(error)
            return response.send("database error")
        }
        console.log(result)
        response.redirect("/admin/applications");
    })
})
//=============================admin click the reject button=============================
app.get("/admin/application/reject/:id",(request,response)=>{
    if(request.session.adminId===undefined){
        return response.redirect("/admin/login")
    }
    const applicationId=request.params.id;
    const sql=` update applications
                set status=?
                where id=?;`;
    db.query(sql,["Rejected",applicationId],(error,result)=>{
        if(error!==null){
            console.log(error)
            return response.send("database error")
        }
        console.log(result)
        response.redirect("/admin/applications")
    })
})
// ================= ADMIN LOGOUT =================

app.get("/admin/logout", (request, response) => {

    request.session.destroy((error) => {

        if (
            error !== null &&
            error !== undefined
        ) {

            console.log(error);

            return response.send("Logout error");

        }


        response.redirect("/admin/login");

    });

});


// ======================================================
// START SERVER
// ======================================================

app.listen(PORT, () => {

    console.log(
        `Server is running on http://localhost:${PORT}`
    );

});