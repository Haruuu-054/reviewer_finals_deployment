//GET FETCH

// Select the table body element where employee data will be displayed
const getemployees = document.querySelector('#employees');
const updateBTN =document.querySelector('#update')
const submit = document.querySelector('#submit');

// Add an event listener to the window to load employee data when the page loads
window.addEventListener('load', () => {
    getEmployees(); // Call the function to fetch and display employee data
});

// Function to fetch employee data from the API and update the table
function getEmployees() {
    let html = ''; // Initialize an empty string to store the HTML for table rows

    // Fetch data from the API
    fetch('https://reviewer-finals-deployment.onrender.com/api/members', { mode: 'cors' })
        .then(response => {
            console.log(response); // Log the raw response for debugging purposes
            return response.json(); // Parse the JSON data from the response
        })
        .then(data => {
            console.log(data); // Log the parsed data for debugging purposes

            // Loop through each member in the data array and create table rows
            data.forEach(element => {
                html += 
`                <tr>
                    <td>${element.id}</td>
                    <td>${element.first_name}</td>
                    <td>${element.last_name}</td> 
                     <td>${element.email}</td>
                     <td>${element.gender}</td>
                    <td><a href = "javascript:void(0)" onClick = "deleteMember(${element.id})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-archive-fill" viewBox="0 0 16 16">
  <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8z"/>
</svg></a>
<a href = "javascript:void(0)" onclick = "updateMember(${element.id})"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
</svg></a></td>
                </tr>`
                ;
            });

            // Update the innerHTML of the table body with the generated rows
            getemployees.innerHTML = html;
        })
        .catch(error => {
            console.log(error); // Log any errors encountered during the fetch process
        });
}


//POST FETCH (INSERT)

submit.addEventListener('click', ()=>{
    let first_name = document.querySelector('#first_name').value
    let last_name = document.querySelector('#last_name').value
    let email = document.querySelector('#email').value
    let gender = document.querySelector('#gender').value

    let formData = {
        'first_name': first_name, 'last_name': last_name, 'email': email, 'gender': gender
    };

    fetch('https://reviewer-finals-deployment.onrender.com/api/members', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers:{
            'Content-Type': 'application/json',
        }
    })
})

//DELETE FETCH
function deleteMember(id) {
    const userConfirmed = confirm("Are you sure you want to delete this member?");
    
    if (userConfirmed) {
        let formData = { id };
        fetch('https://reviewer-finals-deployment.onrender.com/api/members', {
            method: 'DELETE',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.text())
        .then(response => {
            console.log(response);
            alert('Member deleted successfully!');
            location.reload(); // Reload the current page
        })
        .catch(error => {
            console.error(error);
            alert('An error occurred. Please try again.');
        });
    } else {
        console.log("Deletion canceled by the user.");
    }
}

//PUT FETCH (UPDATE)
function updateMember(id) {
    fetch(`https://reviewer-finals-deployment.onrender.com/api/members/${id}`)
        .then(response => response.json())
        .then(data => {
            document.querySelector('#first_name').value = data[0].first_name;
            document.querySelector('#last_name').value = data[0].last_name;
            document.querySelector('#email').value = data[0].email;
            document.querySelector('#gender').value = data[0].gender;
            document.querySelector('#id').value = data[0].id;
        })
        .catch(error => console.log('Error fetching member data:', error));
}

updateBTN.addEventListener('click', () => {
    let first_name = document.querySelector('#first_name').value;
    let last_name = document.querySelector('#last_name').value;
    let email = document.querySelector('#email').value;
    let gender = document.querySelector('#gender').value;
    let id = document.querySelector('#id').value;

    // Form data
    let formData = { first_name, last_name, email, gender, id };

    // Sending the update request
    fetch('https://reviewer-finals-deployment.onrender.com/api/members', {
        method: 'PUT',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (response.ok) {
                // Alert the user on success
                alert('Member updated successfully!');
                // Reload the page
                location.reload();
            } else {
                throw new Error('Failed to update member');
            }
        })
        .catch(error => {
            console.log('Error updating member:', error);
            alert('An error occurred while updating the member.');
        });
});
