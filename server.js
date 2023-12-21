const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override');
const EmployerTable = require('./model/EmployerTable');
const UserTable = require('./model/UserTable');
const JobListingTable = require('./model/JobListingTable');
const JobApp = require('./model/JobApp');
const SaveTable = require('./model/SaveTable');
const NotificationTable = require('./model/NotificationTable');
const bcrypt = require('bcrypt');

const PORT = 7000;

const app = express();
app.use(methodOverride('_method'));
//database connection
mongoose.connect('mongodb://127.0.0.1:27017/Job-Portal',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));


app.get('/views/UserTable.ejs', (req, res) => {
    res.render('UserTable'); // Renders the 'UserTable.ejs' template
  });

app.get('/views/EmployerTable.ejs', (req, res) => {
    res.render('EmployerTable'); // Renders the 'EmployerTable.ejs' template
  });

app.get('/views/JobListingTable.ejs', (req, res) => {
    res.render('JobListingTable'); // Renders the 'EmployerTable.ejs' template
  });

app.get('/views/JobApp.ejs', (req, res) => {
    res.render('JobApp'); // Renders the 'EmployerTable.ejs' template
  });

app.get('/views/SaveTable.ejs', (req, res) => {
    res.render('SaveTable'); // Renders the 'EmployerTable.ejs' template
  });

app.get('/views/NotificationTable.ejs', (req, res) => {
    res.render('NotificationTable'); // Renders the 'EmployerTable.ejs' template
  });

// UserTableFunctions

// Add
app.post('/UserTableSchema', async (req, res) => {
    const { UserID, FirstName, LastName, Email, Password, ContactInformation, Resume, Role } = req.body;
  
    try {
      // Hash the password before saving it
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(Password, saltRounds); // You can adjust the salt rounds (10 in this case) as needed

  
      // Create a new UserTable document with the hashed password
      const newUser = new UserTable({
        UserID,
        FirstName,
        LastName,
        Email,
        Password: hashedPassword, // Store the hashed password
        ContactInformation,
        Resume,
        Role,
        // Assign other fields as needed
      });
  
      // Save the new user to the database
      await newUser.save();
      console.log('User created successfully:', newUser);

      // For example, render a table with all users
      const users = await UserTable.find({});
      res.render('UserTable', { userData: users });
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).send('Error creating user');
    }
    
  });
  
  // Route to render the lab room table when accessing the root URL
app.get('/', async (req, res) => {
  try {
    const userData = await UserTable.find({});
    res.render('userTable', { userData: userData });
  } catch (error) {
    console.error('Error retrieving user table:', error);
    res.status(500).send(error);
  }
});
  
  // Define a route to handle user table
  app.get('/UserTable', async (req, res) => {
    try {
      const userData = await UserTable.find({});// Fetch booking data from your MongoDB
        res.render('userTable', { userData: userData }); // Render the template with booking data
    } catch (error) {
        console.error('Error retrieving user data:', error);
        res.status(500).send(error);
    }
  });
  
  app.post('/del/:id', async (req, res)=> {
    try{
      const userid = req.params.id;
  
      await UserTable.findByIdAndRemove(userid);
      res.redirect('/UserTable');
    }catch(error){
      console.error('Error deleting user:', error);
      res.status(500).send(error);
    }
  });
  
  // Update
  app.post('/UserTable', async (req, res) => {
  try {
    const {
      UserID,
      FirstName,
      LastName,
      Email,
      Password,
      ContactInformation,
      Resume,
      Role
    } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10); // You can adjust the number of rounds for hashing (10 is a common value)

    // Find and update the MongoDB document based on the UserID
    const user = await UserTable.findOneAndUpdate(
      { UserID },
      {
        FirstName,
        LastName,
        Email,
        Password: hashedPassword, // Store the hashed password in the database
        ContactInformation,
        Resume,
        Role,
      },
      { new: true } // To get the updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Retrieve the updated list of users from the UserTable
    const updatedUsers = await UserTable.find({});

    // Render the UserTable.ejs view with the updated user data
    res.render('UserTable', { userData: updatedUsers });

    return res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
  // app.post('/UserTable', async (req, res) => {
  //   try {
  //     const { UserID, FirstName, LastName, Email, Password: hashedPassword, ContactInformation, Resume, Role } = req.body;
  
  //     // Find and update the MongoDB document based on the UserID
  //     const user = await UserTable.findOneAndUpdate(
  //       { UserID },
  //       { FirstName, LastName, Email, Password, ContactInformation, Resume, Role },
  //       { new: true } // To get the updated document
  //     );
  
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }
  
  //     // Retrieve the updated list of users from the UserTable
  //     const updatedUsers = await UserTable.find({});
  
  //     // Render the UserTable.ejs view with the updated user data
  //     res.render('UserTable', { userData: updatedUsers });
  
  //     return res.status(200).json({ message: 'User updated successfully' });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ message: 'Internal server error' });
  //   }
  // });

  // EmployerTableFunctions
// Add
app.post('/EmployerTableSchema', async (req, res) => {
  const { EmployerID, UserID, CompanyName, Industry, CompanyWebsite, ContactInformation } = req.body;

  // Create a new EmployerTable document
  const newEmployer = new EmployerTable({
    EmployerID,
    UserID,
    CompanyName,
    Industry,
    CompanyWebsite,
    ContactInformation,
    // Assign other fields as needed
  });

  try {
    // Save the new employer to the database
    await newEmployer.save();
    console.log('Employer created successfully:', newEmployer);

    // Render a table or redirect to another page (EJS template)
    // For example, render a table with all employers
    const employers = await EmployerTable.find({});
    res.render('EmployerTable', { employerData: employers });
  } catch (err) {
    console.error('Error creating Employer:', err);
    res.status(500).send('Error creating Employer');
  }
});


// Define a route to handle employer table
app.get('/EmployerTable', async (req, res) => {
  try {
    const employerData = await EmployerTable.find({});// Fetch booking data from your MongoDB
      res.render('employerTable', { employerData: employerData }); // Render the template with booking data
  } catch (error) {
      console.error('Error retrieving employer data:', error);
      res.status(500).send(error);
  }
});

// Delete
app.post('/delet/:id', async (req, res)=> {
  try{
    const employerId = req.params.id;

    await EmployerTable.findByIdAndRemove(employerId);
    res.redirect('/EmployerTable');
  }catch(error){
    console.error('Error deleting employer:', error);
    res.status(500).send(error);
  }
});



// Update
app.post('/EmployerTable', async (req, res) => {
  
  try {
    const { EmployerID, UserID, CompanyName,Industry, CompanyWebsite, ContactInformation} = req.body;

    // Find and update the MongoDB document based on EmployerID
    const updatedEmployer = await EmployerTable.findOneAndUpdate(
      { EmployerID },
      { UserID, CompanyName,Industry, CompanyWebsite, ContactInformation },
      { new: true } // To get the updated document
    );

    if (!updatedEmployer) {
      return res.status(404).json({ message: 'Employer not found' });
    }

    // Retrieve the updated list of employer
    const employers = await EmployerTable.find({});

    // Render the CRUD.ejs view with the updated employers data
    res.render('EmployerTable', { employerData: employers });

    return res.status(200).json({ message: 'Employer updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
// //EmployerTableFunctions


// JobListingTableFunctions
// Add
app.post('/JobListingTableSchema', async (req, res) => {
  try {
      const { JobID, EmployerID, JobTitle, JobDescription, JobType, Location, SalaryRange, ApplicationDeadline, ApplicationStatus } = req.body;

      const existingjobListingTable = await JobListingTable.findOne({ JobID });

      
      if (existingjobListingTable) {

        return res.status(400).json({
            message: 'Job ID already exist',
            existingjobListingTable: existingjobListingTable, 
        })
        res.render('jobListingTable', {existingjobListingTable: true});
      }else {
          const jobListTable = new JobListingTable({
            JobID, EmployerID, JobTitle, JobDescription, JobType, Location, SalaryRange, ApplicationDeadline, ApplicationStatus
          });
          await jobListTable.save();
          res.redirect('/JobListingTable');
      }
  } catch (error) {
      console.error('Error creating job listing table:', error);
      res.status(500).send(error);
  }
});

// app.post('/JobListingTableSchema', async (req, res) => {
//   const { JobID, EmployerID, JobTitle, JobDescription, JobType, Location, SalaryRange, ApplicationDeadline, ApplicationStatus } = req.body;

//   // Create a new JobListingTable document
//   const newJobListing = new JobListingTable({
//     JobID,
//     EmployerID,
//     JobTitle,
//     JobDescription,
//     JobType,
//     Location, 
//     SalaryRange,
//     ApplicationDeadline,
//     ApplicationStatus,
//     // Assign other fields as needed
//   });

//   try {
//     // Save the new job list to the database
//     await newJobListing.save();
//     console.log('Job Listing created successfully:', newJobListing);

//     // Render a table or redirect to another page (EJS template)
//     // For example, render a table with all bookings
//     const jobListings = await JobListingTable.find({});
//     res.render('JobListingTable', { jobListingData:jobListings });
//   } catch (err) {
//     console.error('Error creating Job Listing:', err);
//     res.status(500).send('Error creating Job Listing');
//   }
// });


// Define a route to handle job listing table
app.get('/JobListingTable', async (req, res) => {
  try {
    const jobListingData = await JobListingTable.find({});// Fetch job listing data from your MongoDB
      res.render('JobListingTable', { jobListingData: jobListingData }); // Render the template with booking data
  } catch (error) {
      console.error('Error retrieving job listing data:', error);
      res.status(500).send(error);
  }
});

// Delete
app.post('/dele/:id', async (req, res)=> {
  try{
    const jobListingId = req.params.id;

    await JobListingTable.findByIdAndRemove(jobListingId);
    res.redirect('/jobListingTable');
  }catch(error){
    console.error('Error deleting job listing:', error);
    res.status(500).send(error);
  }
});



// Update
app.post('/JobListingTable', async (req, res) => {
  try {
    const { JobID, EmployerID, JobTitle, JobDescription, JobType, Location, SalaryRange, ApplicationDeadline, ApplicationStatus } = req.body;

    // Find and update the MongoDB document based on JobListingID
    const updatedJobListing = await JobListingTable.findOneAndUpdate(
      { JobID },
      { EmployerID, JobTitle, JobDescription, JobType, Location, SalaryRange, ApplicationDeadline, ApplicationStatus },
      { new: true } // To get the updated document
    );

    if (!updatedJobListing) {
      return res.status(404).json({ message: 'Job Listing not found' });
    }

    // Retrieve the updated list of job listing
    const jobListings = await JobListingTable.find({});

    // Render the CRUD.ejs view with the updated job listings data
    res.render('JobListingTable', { jobListingData: jobListings });

    return res.status(200).json({ message: 'Job Listing updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
// JobListingTableFunctions


// JobAppTableFunctions
// Add
app.post('/JobAppSchema', async (req, res) => {
  const { ApplicationID, UserID, JobID, ApplicationDateAndTime,  StartTime, EndTime, CoverLetter, ApplicationStatus } = req.body;

  // Create a new BookingTable document
  const newJobApp = new JobApp({
    ApplicationID,
    UserID,
    JobID,
    ApplicationTimeDate: new Date(),
    StartTime,
    EndTime,
    CoverLetter,
    ApplicationStatus,
    // Assign other fields as needed
  });

  try {
    // Save the new booking to the database
    await newJobApp.save();
    console.log('Job Application created successfully:', newJobApp);

    // Render a table or redirect to another page (EJS template)
    // For example, render a table with all bookings
    const applications = await JobApp.find({});
    res.render('JobApp', { applicationData: applications });
  } catch (err) {
    console.error('Error creating Job Application:', err);
    res.status(500).send('Error creating Job Application');
  }
});


// Define a route to handle booking table
app.get('/JobApp', async (req, res) => {
  try {
    const applicationData = await JobApp.find({});// Fetch booking data from your MongoDB
      res.render('jobApp', { applicationData: applicationData }); // Render the template with booking data
  } catch (error) {
      console.error('Error retrieving job application data:', error);
      res.status(500).send(error);
  }
});

// Delete
app.post('/dels/:id', async (req, res)=> {
  try{
    const jobAppId = req.params.id;

    await JobApp.findByIdAndRemove(jobAppId);
    res.redirect('/jobApp');
  }catch(error){
    console.error('Error deleting job application:', error);
    res.status(500).send(error);
  }
});

// Update
app.post('/JobApp', async (req, res) => {
  try {
    const { ApplicationID, UserID, JobID,ApplicationDateAndTime, CoverLetter, ApplicationStatus } = req.body;

    // Find and update the MongoDB document based on BookingID
    const updatedJobApp = await JobApp.findOneAndUpdate(
      { ApplicationID },
      { UserID, JobID, ApplicationDateAndTime, CoverLetter, ApplicationStatus },
      { new: true } // To get the updated document
    );

    if (!updatedJobApp) {
      return res.status(404).json({ message: 'Job Application not found' });
    }

    // Retrieve the updated list of bookings
    const jobApps = await JobApp.find({});

    // Render the CRUD.ejs view with the updated bookings data
    res.render('JobApp', { applicationData: jobapps });

    return res.status(200).json({ message: 'Job Application updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
// JobAppFunctions

// SaveTableFunctions
// Add
app.post('/SaveTableSchema', async (req, res) => {
  const { RelationID, UserID, JobID, SaveDate } = req.body;

  // Create a new Save Table document
  const newSave = new SaveTable({
    RelationID,
    UserID,
    JobID,
    SaveDate: new Date(), // Set BookingTimeDate to the current date
    // Assign other fields as needed
  });

  try {
    // Save the new save job to the database
    await newSave.save();
    console.log('Save Job created successfully:', newSave);

    // Render a table or redirect to another page (EJS template)
    // For example, render a table with all bookings
    const saves = await SaveTable.find({});
    res.render('SaveTable', { saveData: saves });
  } catch (err) {
    console.error('Error creating save job:', err);
    res.status(500).send('Error creating save job');
  }
});


// Define a route to handle booking table
app.get('/SaveTable', async (req, res) => {
  try {
    const saveData = await SaveTable.find({});// Fetch booking data from your MongoDB
      res.render('saveTable', { saveData: saveData }); // Render the template with booking data
  } catch (error) {
      console.error('Error retrieving saving job data:', error);
      res.status(500).send(error);
  }
});

// Delete
app.post('/deleted/:id', async (req, res)=> {
  try{
    const saveId = req.params.id;

    await SaveTable.findByIdAndRemove(saveId);
    res.redirect('/saveTable');
  }catch(error){
    console.error('Error deleting job application:', error);
    res.status(500).send(error);
  }
});




// Update
app.post('/SaveTable', async (req, res) => {
  try {
    const { RelationID, UserID, JobID, SaveDate } = req.body;

    // Find and update the MongoDB document based on BookingID
    const updatedSave = await SaveTable.findOneAndUpdate(
      { RelationID },
      { UserID, JobID, SaveDate },
      { new: true } // To get the updated document
    );

    if (!updatedSave) {
      return res.status(404).json({ message: 'Save job not found' });
    }

    // Retrieve the updated list of bookings
    const saves = await SaveTable.find({});

    // Render the CRUD.ejs view with the updated bookings data
    res.render('SaveTable', { saveData: saves });

    return res.status(200).json({ message: 'Saving Job updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
// SaveTableFunctions

// NotificationTableFunctions
// Add
app.post('/NotificationTableSchema', async (req, res) => {
  const { NotificationID, UserID, NotificationType, Content, Timestamp, Status } = req.body;

  // Create a new Notification Table document
  const newNotification = new NotificationTable({
    NotificationID,
    UserID,
    NotificationType,
    Content,
    Timestamp: new Date(),
    Status,
    // Assign other fields as needed
  });

  try {
    // Save the new save job to the database
    await newNotification.save();
    console.log('Notification created successfully:', newNotification);

    // Render a table or redirect to another page (EJS template)
    // For example, render a table with all bookings
    const notifications = await NotificationTable.find({});
    res.render('NotificationTable', { notificationData: notifications });
  } catch (err) {
    console.error('Error creating notification:', err);
    res.status(500).send('Error creating notification');
  }
});


// Define a route to handle booking table
app.get('/NotificationTable', async (req, res) => {
  try {
    const notificationData = await NotificationTable.find({});// Fetch booking data from your MongoDB
      res.render('notificationTable', { notificationData: notificationData }); // Render the template with booking data
  } catch (error) {
      console.error('Error retrieving notification data:', error);
      res.status(500).send(error);
  }
});

// // Delete
// app.post('/delet/:id', async (req, res)=> {
//   try{
//     const notificationid = req.params.id;

//     await NotificationTable.findByIdAndRemove(notificationid);
//     res.redirect('/NotificationTable');
//   }catch(error){
//     console.error('Error deleting notification:', error);
//     res.status(500).send(error);
//   }
// });

  
app.post('/deletion/:id', async (req, res)=> {
  try{
    const notificationid = req.params.id;

    await NotificationTable.findByIdAndRemove(notificationid);
    res.redirect('/notificationTable');
  }catch(error){
    console.error('Error deleting notification:', error);
    res.status(500).send(error);
  }
});

// Update
app.post('/NotificationTable', async (req, res) => {
  try {
    const { NotificationID, UserID, NotificationType, Content, Timestamp, Status } = req.body;

    // Find and update the MongoDB document based on BookingID
    const updatedNotification = await NotificationTable.findOneAndUpdate(
      { NotificationID },
      { UserID, NotificationType, Content, Timestamp, Status },
      { new: true } // To get the updated document
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Retrieve the updated list of bookings
    const notifications = await NotificationTable.find({});

    // Render the CRUD.ejs view with the updated bookings data
    res.render('NotificationTable', { notificationData: notifications });

    return res.status(200).json({ message: 'Notification updated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
// NotificationTableFunctions

  app.listen(PORT, ()=>{
    console.log(`Server is running on localhost:${PORT}`);
});