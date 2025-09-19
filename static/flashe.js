// flashe.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let productData = {}; // productData is defined here

    // Load product data first
    loadProductData();

    // Initialize form (these can be initialized before productData is fully loaded,
    // as their event listeners will trigger updatePrice later)
    initForm();
    // Initialize modal
    initModal();
    // Initialize governorate search and selection
    initGovernorateSearch();
    // Add scroll animations
    initScrollAnimations();
    // Add smooth scrolling for anchor links
    initSmoothScrolling();
    // Initialize countdown timer (can run independently)
    initCountdownTimer();
});

// Load product data from JSON
function loadProductData() {
    fetch('data/flashe.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Set all flash drive prices to a unified price (e.g., 515 before discount)
            const unifiedPrice = 515;
            productData = { // productData is assigned here
                ...data,
                flashTypes: data.flashTypes.map(type => ({ ...type, price: unifiedPrice })),
            };
            populateFlashTypes();
            populateGovernoratesList(); // <<< Changed function name
            updatePrice(); // <<< IMPORTANT: Call updatePrice AFTER productData is loaded
        })
        .catch(error => {
            console.error('Error loading product data:', error);
            // Set default values if file not found
            const unifiedPrice = 515;
            productData = { // productData is assigned here even on error
                flashTypes: [
                    { id: "basic", name: "فلاشة الحاسب الالي والبرمجة للأطفال", price: unifiedPrice },
                    { id: "foundation", name: "فلاشة تأسيس الطفل", price: unifiedPrice },
                    { id: "drawing", name: "فلاشة تعليم الرسم للأطفال", price: unifiedPrice },
                    { id: "muslim_child", name: "فلاشة الطفل المسلم 3*1", price: unifiedPrice },
                    { id: "english", name: "فلاشة تعليم الإنجليزية للأطفال", price: unifiedPrice },
                    { id: "prayer", "name": "فلاشة تعليم الصلاه للأطفال", price: unifiedPrice },
                    { id: "prophets", "name": "فلاشة قصص الانبياء", price: unifiedPrice },
                    { id: "islamic_cartoon", "name": "فلاشة مسلسلات الكرتون الاسلامي", price: unifiedPrice },
                    { id: "dubbed_cartoon", "name": "فلاشة كرتون الاطفال المدبلج", price: unifiedPrice },
                    { id: "golden_age_cartoon", "name": "فلاشة كرتون الزمن الجميل", price: unifiedPrice },
                    { id: "family_cartoon", "name": "فلاشة كرتون العيلة", price: unifiedPrice },
                    { id: "islamic_cartoon2", "name": "فلاشة الكرتون الاسلامي", price: unifiedPrice },
                    { id: "family_cartoon2", "name": "فلاشة كرتون كل الاسرة (توم و جيري)", price: unifiedPrice },
                    { id: "light_games", "name": "فلاشة العاب الكمبيوتر الخفيفه", price: unifiedPrice }
                ],
                discount: 0.25, // 25% discount
                whatsapp: "201117635075",
                shipping: {
                    "القاهرة": 70,
                    "الجيزة": 70,
                    "القليوبية": 70,
                    "الإسكندرية": 70,
                    "البحيرة": 70,
                    "كفر الشيخ": 70,
                    "الدقهلية": 70,
                    "دمياط": 70,
                    "الغربية": 70,
                    "المنوفيه": 70,
                    "الشرقية": 70,
                    "بورسعيد": 70,
                    "الإسماعيلية": 70,
                    "السويس": 70,
                    "مطروح": 95,
                    "جنوب سيناء": 100,
                    "بني سويف": 70,
                    "الفيوم": 70,
                    "المنيا": 70,
                    "أسيوط": 70,
                    "سوهاج": 70,
                    "قنا": 70,
                    "الأقصر": 70,
                    "أسوان": 70,
                    "البحر الاحمر": 95
                },
                freeShippingThreshold: 2, // Free shipping for 2 or more items
                unavailableGovernorates: ["شمال سيناء", "الوادي الجديد"]
            };
            populateFlashTypes();
            populateGovernoratesList(); // <<< Changed function name
            updatePrice(); // <<< IMPORTANT: Call updatePrice AFTER productData is loaded
        })
        .finally(() => {
            // Load images for carousel after product data (or default) is set
            loadImagesForCarousel();
        });
}

// Populate flash drive types in the form
function populateFlashTypes() {
    const flashTypeSelect = document.getElementById('flash-type');
    // Clear existing options except the first one
    while (flashTypeSelect.options.length > 1) {
        flashTypeSelect.remove(1);
    }
    // Add options from product data
    if (productData.flashTypes && productData.flashTypes.length > 0) {
        productData.flashTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.id;
            option.textContent = type.name;
            flashTypeSelect.appendChild(option);
        });
    }
}

// Populate governorates in the new UL list
function populateGovernoratesList() { // <<< Renamed function
    const governorateOptionsList = document.getElementById('governorate-options-list'); // <<< New element ID
    governorateOptionsList.innerHTML = ''; // Clear existing items

    const availableGovernorates = Object.keys(productData.shipping);
    availableGovernorates.forEach(gov => {
        const listItem = document.createElement('li'); // <<< Create LI element
        listItem.textContent = gov;
        listItem.dataset.value = gov; // Store the value in a data attribute
        governorateOptionsList.appendChild(listItem);
    });

    // Populate unavailable governorates modal (no change here)
    const unavailableList = document.getElementById('unavailable-governorates-list');
    unavailableList.innerHTML = '';
    if (productData.unavailableGovernorates) {
        productData.unavailableGovernorates.forEach(gov => {
            const li = document.createElement('li');
            li.textContent = gov;
            unavailableList.appendChild(li);
        });
    }
}

// --- Carousel Logic ---
let allCarouselImages = []; // Array to hold all image paths
let carouselInterval; // Variable to hold the interval ID

function loadImagesForCarousel() {
    const carouselContainer = document.getElementById('main-carousel');
    carouselContainer.innerHTML = ''; // Clear existing items

    // Assuming images are flashe1.png to flashe14.png
    for (let i = 1; i <= 4; i++) {
        allCarouselImages.push(`assets/images/flashe${i}.png`);
    }

    // Create carousel items dynamically
    allCarouselImages.forEach((src, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('carousel-item');
        itemDiv.style.display = 'none'; 
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Flashe Product ${index + 1}`;
        itemDiv.appendChild(img);
        carouselContainer.appendChild(itemDiv);
    });

    initCarousel(); // Now initialize the carousel after images are loaded
}

function initCarousel() {
    const carouselItems = document.querySelectorAll('#main-carousel .carousel-item');
    if (carouselItems.length === 0) {
        console.warn("No carousel items found to initialize.");
        return;
    }

    let currentCenterIndex = 0; 
    const visibleItemsCount = 4; 

    function updateCarouselPositions() {
        carouselItems.forEach((item, index) => {
            item.classList.remove('back', 'left', 'center', 'right');
            item.style.display = 'none'; 

            let relativeIndex = index - currentCenterIndex;
            if (relativeIndex < -allCarouselImages.length / 2) { 
                relativeIndex += allCarouselImages.length;
            } else if (relativeIndex > allCarouselImages.length / 2) { 
                relativeIndex -= allCarouselImages.length;
            }

            if (relativeIndex === 0) {
                item.classList.add('center');
                item.style.display = 'block';
            } else if (relativeIndex === 1) {
                item.classList.add('right');
                item.style.display = 'block';
            } else if (relativeIndex === -1) {
                item.classList.add('left');
                item.style.display = 'block';
            } else {
                const backIndex = (currentCenterIndex - 2 + allCarouselImages.length) % allCarouselImages.length;
                if (index === backIndex) {
                    item.classList.add('back');
                    item.style.display = 'block';
                }
            }
        });
    }

    function rotateCarousel() {
        currentCenterIndex = (currentCenterIndex + 1) % allCarouselImages.length;
        updateCarouselPositions();
    }

    updateCarouselPositions();
    carouselInterval = setInterval(rotateCarousel, 1500); 
}

// --- End Carousel Logic ---

// Initialize modal
function initModal() {
    const moreModal = document.getElementById('more-modal');
    const btnMore = document.getElementById('more-btn'); 
    const moreModalClose = moreModal.querySelector('.close-modal');
    const zoomModal = document.getElementById('image-zoom-modal');
    const zoomModalClose = zoomModal.querySelector('.close-modal.zoom-close'); 
    const zoomedImage = document.getElementById('zoomed-image');
    const deliveryUnavailableModal = document.getElementById('delivery-unavailable-modal');
    const deliveryUnavailableLink = document.getElementById('delivery-unavailable-link');
    const deliveryUnavailableClose = deliveryUnavailableModal.querySelector('.close-modal');

    btnMore.onclick = function() { 
        moreModal.style.display = "block"; 
        document.body.style.overflow = "hidden"; 
    }

    moreModalClose.onclick = function() {
        moreModal.style.display = "none";
        document.body.style.overflow = "auto";
    }

    zoomModalClose.onclick = function() {
        zoomModal.style.display = "none";
        document.body.style.overflow = "auto";
    }

    deliveryUnavailableLink.onclick = function(e) {
        e.preventDefault();
        deliveryUnavailableModal.style.display = "block";
        document.body.style.overflow = "hidden";
    }

    deliveryUnavailableClose.onclick = function() {
        deliveryUnavailableModal.style.display = "none";
        document.body.style.overflow = "auto";
    }

    window.onclick = function(event) {
        if (event.target == moreModal) {
            moreModal.style.display = "none";
            document.body.style.overflow = "auto";
        }
        if (event.target == zoomModal) {
            zoomModal.style.display = "none";
            document.body.style.overflow = "auto";
        }
        if (event.target == deliveryUnavailableModal) {
            deliveryUnavailableModal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }

    const modalImages = document.querySelectorAll('#more-modal .modal-image'); 
    modalImages.forEach(img => {
        img.addEventListener('click', function() {
            zoomedImage.src = this.src;
            zoomModal.style.display = "block";
            document.body.style.overflow = "hidden";
        });
    });
}

// Initialize form
function initForm() {
    const form = document.getElementById('order-form');
    const flashType = document.getElementById('flash-type');
    const quantity = document.getElementById('quantity');
    const governorateInput = document.getElementById('governorate-input');
    // const governorateSelect = document.getElementById('governorate'); // <<< REMOVED
    const governorateToggle = document.querySelector('.governorate-toggle');
    const governorateListDiv = document.querySelector('.governorate-list');
    const multipleTypesGroup = document.getElementById('multiple-types-group');
    const multipleTypesTextarea = document.getElementById('multiple-types');
    const governorateOptionsList = document.getElementById('governorate-options-list'); // <<< NEW

    flashType.addEventListener('change', updatePrice);
    quantity.addEventListener('change', function() {
        const quantityNum = parseInt(this.value);
        if (quantityNum > 1) {
            multipleTypesGroup.style.display = 'block';
            // Make multipleTypesTextarea required if flashType is not selected
            if (!flashType.value) {
                multipleTypesTextarea.setAttribute('required', 'required');
            }
        } else {
            multipleTypesGroup.style.display = 'none';
            multipleTypesTextarea.removeAttribute('required');
            multipleTypesTextarea.value = ''; 
        }
        updatePrice(); 
    });

    // Event listener for clicking on a governorate in the new UL list
    governorateOptionsList.addEventListener('click', function(event) { // <<< NEW
        if (event.target.tagName === 'LI') {
            const selectedGovernorate = event.target.dataset.value; // Get value from data-value
            governorateInput.value = selectedGovernorate; // Set the input field
            governorateListDiv.classList.remove('active'); // Hide the dropdown
            updatePrice();
        }
    });

    // Show dropdown immediately on toggle click
    governorateToggle.addEventListener('click', function() {
        governorateListDiv.classList.toggle('active');
        if (governorateListDiv.classList.contains('active')) {
            document.getElementById('governorate-search').focus();
            // Scroll to top of the list when opened
            governorateOptionsList.scrollTop = 0;
        }
    });

    // Hide dropdown if clicked outside
    document.addEventListener('click', function(event) {
        // Check if the click was outside the governorate-dropdown container
        const governorateDropdownContainer = document.querySelector('.governorate-dropdown');
        if (!governorateDropdownContainer.contains(event.target) && event.target !== governorateInput) {
            governorateListDiv.classList.remove('active');
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const name = document.getElementById('name').value.trim();
        const flashTypeValue = flashType.value;
        const quantityValue = quantity.value;
        const phone = document.getElementById('phone').value.trim();
        const altPhone = document.getElementById('alt-phone').value.trim();
        const governorate = governorateInput.value; // <<< Get value from the input field
        const address = document.getElementById('address').value.trim();
        const notes = document.getElementById('notes').value.trim();
        const multipleTypes = multipleTypesTextarea.value.trim();

        let flashTypeName = '';
        if (productData.flashTypes) {
            const selectedType = productData.flashTypes.find(type => type.id === flashTypeValue);
            if (selectedType) {
                flashTypeName = selectedType.name;
            }
        }

        let orderDetails = '';
        const quantityNum = parseInt(quantityValue);

        if (quantityNum > 1 && multipleTypes) {
            orderDetails = multipleTypes;
        } else if (quantityNum > 1 && flashTypeName) {
            orderDetails = `${quantityNum} قطعة من فلاشة ${flashTypeName}`;
        } else if (quantityNum === 1 && flashTypeName) {
            orderDetails = `فلاشة ${flashTypeName}`;
        } else {
            orderDetails = 'لم يتم تحديد نوع الفلاشة/الفلاشات';
        }

        let message = `مرحبًا، إسمي ${name}

📦 الطلب:
${orderDetails}

📞 أرقام التواصل:
رقم أساسي: ${phone}`;
        if (altPhone) {
            message += `
رقم بديل: ${altPhone}`;
        }
        message += `

📍 العنوان:
${governorate} – ${address}`;
        if (notes) {
            message += `

📝 ملاحظات:
${notes}`;
        }

        const totalCostElement = document.getElementById('total-cost');
        message += `

💰 إجمالي التكلفة:
${totalCostElement.textContent}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${productData.whatsapp}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    });
}

function validateForm() {
    const name = document.getElementById('name').value.trim();
    const flashType = document.getElementById('flash-type').value.trim();
    const quantity = document.getElementById('quantity').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const governorate = document.getElementById('governorate-input').value.trim(); // <<< Get value from the input field
    const address = document.getElementById('address').value.trim();
    const multipleTypesTextarea = document.getElementById('multiple-types').value.trim();

    if (!name) {
        alert('الاسم الكامل مطلوب.');
        return false;
    }
    if (!quantity) {
        alert('عدد القطع مطلوب.');
        return false;
    }
    const quantityNum = parseInt(quantity);
    
    // Validation for flash type / multiple types
    if (quantityNum === 1) {
        if (!flashType) {
            alert('نوع الفلاشة مطلوب عند طلب قطعة واحدة.');
            return false;
        }
    } else if (quantityNum > 1) {
        // If quantity > 1, either flashType or multipleTypesTextarea must be filled
        if (!flashType && !multipleTypesTextarea) {
            alert('يرجى تحديد نوع الفلاشة أو تخصيص الأنواع عند طلب أكثر من قطعة.');
            return false;
        }
    }

    if (!phone) {
        alert('رقم الهاتف مطلوب.');
        return false;
    }
    if (!governorate) {
        alert('المحافظة مطلوبة.');
        return false;
    }
    if (productData.unavailableGovernorates && productData.unavailableGovernorates.includes(governorate)) {
        alert(`عذرًا، لا يتوفر التوصيل إلى محافظة ${governorate}. يرجى اختيار محافظة أخرى.`);
        return false;
    }
    if (!address) {
        alert('العنوان بالتفصيل مطلوب.');
        return false;
    }
    return true;
}

// Initialize governorate search
function initGovernorateSearch() {
    const governorateSearch = document.getElementById('governorate-search');
    const governorateOptionsList = document.getElementById('governorate-options-list'); // <<< NEW

    governorateSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const listItems = governorateOptionsList.getElementsByTagName('li'); // <<< Get LI elements
        for (let i = 0; i < listItems.length; i++) {
            const listItem = listItems[i];
            const itemText = listItem.textContent.toLowerCase();
            if (itemText.includes(searchTerm)) {
                listItem.style.display = '';
            } else {
                listItem.style.display = 'none';
            }
        }
    });
}

// Update price based on selections
function updatePrice() {
    // Ensure productData is loaded before proceeding
    if (!productData || !productData.flashTypes || !productData.shipping) {
        resetCostDisplay();
        return;
    }

    const flashType = document.getElementById('flash-type').value;
    const quantity = document.getElementById('quantity').value;
    const governorate = document.getElementById('governorate-input').value; // <<< Get value from the input field
    const multipleTypesTextarea = document.getElementById('multiple-types');

    const quantityNum = parseInt(quantity);
    const basePricePerUnit = productData.flashTypes[0].price; // Assuming all flash drives have the same base price
    const discountRate = productData.discount || 0;
    const totalPriceBeforeDiscount = basePricePerUnit * quantityNum;
    const totalPriceAfterDiscount = totalPriceBeforeDiscount * (1 - discountRate);

    let shippingCost = 0;
    if (quantityNum < productData.freeShippingThreshold) { 
        // Check if the selected governorate exists in productData.shipping
        if (productData.shipping.hasOwnProperty(governorate)) {
            shippingCost = productData.shipping[governorate];
        } else {
            // If governorate is not found (e.g., not yet selected or invalid), set shipping to 0 or a default
            shippingCost = 0; // Or a default value like 70
        }
    } else {
        shippingCost = 0; // Free shipping
    }

    const totalCost = totalPriceAfterDiscount + shippingCost;

    updateCostDisplay(flashType, quantityNum, totalPriceBeforeDiscount, totalPriceAfterDiscount, shippingCost, totalCost, multipleTypesTextarea.value.trim());
}

function resetCostDisplay() {
    document.getElementById('selected-items').textContent = "-";
    document.getElementById('unit-price').textContent = "0 ج.م";
    document.getElementById('discounted-price').textContent = "0 ج.م";
    document.getElementById('shipping-cost').textContent = "0 ج.م";
    document.getElementById('total-cost').textContent = "0 ج.م";
}

function updateCostDisplay(selectedFlashTypeId, quantityNum, totalPriceBeforeDiscount, totalPriceAfterDiscount, shippingCost, totalCost, customTypes) {
    let selectedItemsText;
    if (quantityNum > 1 && customTypes) {
        selectedItemsText = `${quantityNum} قطعة: ${customTypes}`;
    } else if (quantityNum > 1) {
        // If multiple items but no custom types, try to get the name of the selected flash type
        const selectedType = productData.flashTypes.find(type => type.id === selectedFlashTypeId);
        const flashTypeName = selectedType ? selectedType.name : 'أنواع متعددة';
        selectedItemsText = `${quantityNum} قطعة من ${flashTypeName}`;
    } else {
        const selectedType = productData.flashTypes.find(type => type.id === selectedFlashTypeId);
        const flashTypeName = selectedType ? selectedType.name : 'لم يتم التحديد';
        selectedItemsText = `${quantityNum} قطعة من ${flashTypeName}`;
    }

    document.getElementById('selected-items').textContent = selectedItemsText;
    document.getElementById('unit-price').textContent = `${totalPriceBeforeDiscount.toFixed(2)} ج.م`;
    document.getElementById('discounted-price').textContent = `${totalPriceAfterDiscount.toFixed(2)} ج.م`;
    document.getElementById('shipping-cost').textContent = `${shippingCost.toFixed(2)} ج.م`;
    document.getElementById('total-cost').textContent = `${totalCost.toFixed(2)} ج.م`;
}

// Countdown Timer - يعمل بشكل دوري كل 7 أيام
function initCountdownTimer() {
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    // ⚠️ 👇 مدة العرض: 7 أيام بالمللي ثانية
    const durationMs = 7 * 24 * 60 * 60 * 1000;

    // نحسب أول تاريخ انتهاء: الآن + 7 أيام
    let endDate = new Date(Date.now() + durationMs);

    const updateCountdown = () => {
        const now = new Date();
        let distance = endDate.getTime() - now.getTime();

        // إذا انتهى الوقت، نبدأ دورة جديدة!
        if (distance <= 0) {
            endDate = new Date(now.getTime() + durationMs); // ← هنا السحر! نضيف 7 أيام جديدة
            distance = endDate.getTime() - now.getTime();   // ← نعيد حساب المسافة للدورة الجديدة
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (daysElement) daysElement.textContent = String(days).padStart(2, '0');
        if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
        if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, '0');
        if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, '0');
    };

    // التحديث كل ثانية
    setInterval(updateCountdown, 1000);
    updateCountdown(); // تحديث فوري عند تحميل الصفحة
}

// Initialize scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.hero-content, .features-grid .feature-item, .testimonial, .order-form-container').forEach(el => {
        observer.observe(el);
    });

    document.querySelectorAll('.features-grid .feature-item').forEach((el, index) => {
        el.classList.add(`delay-${index + 1}`);
    });
    document.querySelectorAll('.testimonial').forEach((el, index) => {
        el.classList.add(`delay-${index + 1}`);
    });
}

// Add smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}
