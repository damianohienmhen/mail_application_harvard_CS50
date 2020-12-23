document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#the-email').addEventListener('click', the_email('email_id'));

  

  // By default, load the inbox
  load_mailbox('sent');
});

function the_email(email_id) { 

  

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#the-email').style.display = 'block';
  document.querySelector('#container').style.display = 'none';

  // Set variables 
  


  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
  document.querySelector('#emailsender').innerHTML = `<div> <b>From:</b> ${email.sender}</div>`;
  document.querySelector('#emailreceiver').innerHTML = `<div> <b>To:</b> ${email.recipients}</div>`;
  document.querySelector('#emailsubject').innerHTML = `<div> <b>Subject:</b> ${email.subject}</div>`;
  document.querySelector('#timestamp').innerHTML = `<div> <b>Timestamp:</b> ${email.timestamp}</div>`;
  document.querySelector('#emailbody').innerHTML = `<div>${email.body}</div>`;
  
  document.querySelector('#archive').innerHTML = `<button onclick="archive(${email.id})">Archive</button>`;
   document.querySelector('#unarchive').innerHTML = `<button onclick="unarchive(${email.id})">Unarchive</button>`;
    document.querySelector('#markread').innerHTML = `<button onclick="markread(${email.id})">Mark Read</button>`;
     document.querySelector('#markunread').innerHTML = `<button onclick="markunread(${email.id})">Mark Unread</button>`;
      document.querySelector('#replyemail').innerHTML = `<button onclick="replyemail(${email.id})">Reply Email</button>`;
  
 
  
  console.log(email);
 
  
  })
  };
  

function archive(email_id) { 



  fetch(`/emails/${email_id}`, {
  method: 'PUT',
  body: JSON.stringify({
      archived:true
 })
})
load_mailbox('inbox');
};

function unarchive(email_id) { 



  fetch(`/emails/${email_id}`, {
  method: 'PUT',
  body: JSON.stringify({
      archived: false
 })
})
load_mailbox('inbox');
};

function markread(email_id) { 



  fetch(`/emails/${email_id}`, {
  method: 'PUT',
  body: JSON.stringify({
      read: true
 })
})

};

function markunread(email_id) { 



  fetch(`/emails/${email_id}`, {
  method: 'PUT',
  body: JSON.stringify({
      read: false
 })
})

};

function replyemail(email_id) { 
fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
  document.querySelector('#compose-recipients').value = `${email.recipients}`;
  document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
  document.querySelector('#compose-body').value = `"On ${email.timestamp} ${email.sender} wrote:" ${email.body}`;
  })
  

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
   document.querySelector('#the-email').style.display = 'none';
    document.querySelector('#container').style.display = 'none';

  // Clear out composition fields
  

  
  
document.querySelector('form').onsubmit = function() {
  const recipients = document.querySelector('#compose-recipients').value
   const subject = document.querySelector('#compose-subject').value
    const body = document.querySelector('#compose-body').value
    
  fetch('/emails', {
  method: 'POST',
  body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
  })
})
.then(response => response.json())
.then(result => {
    // Print result
    console.log(result);
});

}

};

function compose_email() { 

  

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
   document.querySelector('#the-email').style.display = 'none';
    document.querySelector('#container').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  
  
document.querySelector('form').onsubmit = function() {
  const recipients = document.querySelector('#compose-recipients').value
   const subject = document.querySelector('#compose-subject').value
    const body = document.querySelector('#compose-body').value
  fetch('/emails', {
  method: 'POST',
  body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
  })
})
.then(response => response.json())
.then(result => {
    // Print result
    console.log(result);
});

}

};

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#container').style.display = 'block';
  document.querySelector('#the-email').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
 fetch(`/emails/${mailbox}`) 
.then(response => response.json())
.then(emails => {
    html = '';
    emails.forEach(email => {
    htmlSegment = `<div onclick="the_email(${email.id})" id = "theemail" class="containerborder">${email.sender} ${email.subject}
                  <span class="time-right">${email.timestamp}</span></div>`;
                        
        html += htmlSegment;
    });
    
    container = document.querySelector('#container')
    container.innerHTML = html;
    // Print emails
    console.log(emails);

    // ... do something else with emails ...
});
  
}
