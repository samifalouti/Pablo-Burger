document.addEventListener('DOMContentLoaded', function() {
    const tableSelection = document.querySelector('.table-selection');
    const selectTableBtn = document.getElementById('select-table-btn');
    const tableModal = document.getElementById('table-modal');
    const tableModalContent = document.querySelector('.modal-content');
    const addItemBtn = document.getElementById('add-item-btn');
    const searchBar = document.getElementById('search-bar');
    const searchDropdown = document.getElementById('search-dropdown');
    const selectedItemsContainer = document.getElementById('selected-items-container');
    const orderDetails = document.getElementById('order-details');
    const orderForm = document.getElementById('order-form');
    const successMessage = document.getElementById('success-message');
    const tables = ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Table 7', 'Table 8', 'Table 9', 'Table 10'];

    const menuItems = [
        'Burger poulet', 
        'Burger double poulet', 
        'Burger viande', 
        'Burger double viande', 
        'Burger Pablo', 
        'Burger croize', 
        'Tacos poulet', 
        'Tacos viande', 
        'Tacos Abat', 
        'Panini poulet', 
        'Panini Viande', 
        'Panini Abat', 
        'Panini 3 fromages'
    ];
    
    // Populate table selection
    tables.forEach(table => {
        const tableDiv = document.createElement('div');
        tableDiv.classList.add('table');
        tableDiv.textContent = table;
        tableDiv.addEventListener('click', () => {
            tableSelection.innerHTML = `<p>Selected Table: ${table}</p>`;
            tableModal.style.display = 'none';
            document.getElementById('selected-table').value = table;
        });
        tableModalContent.querySelector('.tables').appendChild(tableDiv);
    });

    menuItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.textContent = item;
        itemDiv.addEventListener('click', () => {
            searchBar.value = item;
            searchDropdown.classList.remove('show');
        });
        searchDropdown.appendChild(itemDiv);
    });

    searchBar.addEventListener('input', () => {
        const filter = searchBar.value.toLowerCase();
        const items = searchDropdown.querySelectorAll('div');
        let anyVisible = false;
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(filter)) {
                item.style.display = '';
                anyVisible = true;
            } else {
                item.style.display = 'none';
            }
        });
        searchDropdown.classList.toggle('show', anyVisible);
    });

    document.addEventListener('click', (event) => {
        if (!searchBar.contains(event.target) && !searchDropdown.contains(event.target)) {
            searchDropdown.classList.remove('show');
        }
    });

    // Open table selection modal
    selectTableBtn.addEventListener('click', () => {
        tableModal.style.display = 'block';
    });

    // Close modal when click on close button or outside modal
    const closeBtn = document.querySelector('.close');
    window.onclick = function(event) {
        if (event.target == tableModal) {
            tableModal.style.display = 'none';
        }
    };

    closeBtn.onclick = function() {
        tableModal.style.display = 'none';
    };

    // Handle adding items
    addItemBtn.addEventListener('click', () => {
        const itemName = searchBar.value.trim();
        if (itemName === '') return;

        const itemDiv = document.createElement('div');
        itemDiv.classList.add('selected-item');

        const itemText = document.createElement('span');
        itemText.textContent = itemName;

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-btn'); // Add a class for styling
        const removeIcon = document.createElement('img');
        removeIcon.src = './images/delete.png'; // Path to your remove image
        removeIcon.alt = 'Remove';
        removeBtn.appendChild(removeIcon);

        removeBtn.addEventListener('click', () => {
            itemDiv.remove();
            updateOrderDetails();
        });

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = 1;
        quantityInput.min = 1;
        quantityInput.addEventListener('change', updateOrderDetails);

        itemDiv.appendChild(itemText);
        itemDiv.appendChild(quantityInput);
        itemDiv.appendChild(removeBtn);
        selectedItemsContainer.appendChild(itemDiv);

        searchBar.value = '';
        updateOrderDetails();
    });

    // Update order details textarea
    function updateOrderDetails() {
        const items = selectedItemsContainer.querySelectorAll('.selected-item');
        const orderDetailsArray = Array.from(items).map(item => {
            const itemName = item.querySelector('span').textContent;
            const quantity = item.querySelector('input').value;
            return `${itemName} (x${quantity})`;
        });
        orderDetails.value = orderDetailsArray.join(', ');
    }

    // Handle form submission
    orderForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way
    
        if (document.getElementById('selected-table').value === '') {
            alert('Veuillez sélectionner une table avant de passer la commande.');
            return;
        }
    
        var formData = new FormData(this);
    
        fetch(this.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(result => {
            successMessage.style.display = 'block'; // Show the success message
            orderForm.reset(); // Reset the form if needed
            tableSelection.innerHTML = ''; // Clear selected table
            selectedItemsContainer.innerHTML = ''; // Clear selected items
            setTimeout(() => {
                successMessage.style.display = 'none'; // Hide the success message after 3 seconds
                location.reload(); // Refresh the website
            }, 3000);
        })
        .catch(error => console.error('Error!', error.message));
    });
    
});
