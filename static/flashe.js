// flashe.js
document.addEventListener('DOMContentLoaded', function() {
    let productData = {};

    loadProductData();
    initForm();
    initModal();
    initGovernorateSearch();
    initScrollAnimations();
    initSmoothScrolling();
});

// Load product data from JSON
function loadProductData() {
    fetch('data/flashe.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const unifiedPrice = 515;
            productData = {
                ...data,
                flashTypes: data.flashTypes.map(type => ({ ...type, price: unifiedPrice })),
            };
            populateFlashTypes();
            populateGovernoratesList();
            updatePrice();
        })
        .catch(error => {
            console.error('Error loading product data:', error);
            const unifiedPrice = 515;
            productData = {
                flashTypes: [
                    { id: "basic", name: "فلاشة الحاسب الالي والبرمجة للأطفال", price: unifiedPrice },
                    { id: "foundation", name: "فلاشة تأسيس الطفل", price: unifiedPrice },
                    { id: "drawing", name: "فلاشة تعليم الرسم للأطفال", price: unifiedPrice },
                    { id: "muslim_child", name: "فلاشة الطفل المسلم 3*1", price: unifiedPrice },
                    { id: "english", name: "فلاشة تعليم الإنجليزية للأطفال", price: unifiedPrice },
                    { id: "prayer", name: "فلاشة تعليم الصلاه للأطفال", price: unifiedPrice },
                    { id: "prophets", name: "فلاشة قصص الانبياء", price: unifiedPrice },
                    { id: "islamic_cartoon", name: "فلاشة مسلسلات الكرتون الاسلامي", price: unifiedPrice },
                    { id: "dubbed_cartoon", name: "فلاشة كرتون الاطفال المدبلج", price: unifiedPrice },
                    { id: "golden_age_cartoon", name: "فلاشة كرتون الزمن الجميل", price: unifiedPrice },
                    { id: "family_cartoon", name: "فلاشة كرتون العيلة", price: unifiedPrice },
                    { id: "islamic_cartoon2", name: "فلاشة الكرتون الاسلامي", price: unifiedPrice },
                    { id: "family_cartoon2", name: "فلاشة كرتون كل الاسرة (توم و جيري)", price: unifiedPrice },
                    { id: "light_games", name: "فلاشة العاب الكمبيوتر الخفيفه", price: unifiedPrice }
                ],
                discount: 0.25,
                whatsapp: "201117635075",
                shipping: {
                    "القاهرة": 70, "الجيزة": 70, "القليوبية": 70, "الإسكندرية": 70,
                    "البحيرة": 70, "كفر الشيخ": 70, "الدقهلية": 70, "دمياط": 70,
                    "الغربية": 70, "المنوفيه": 70, "الشرقية": 70, "بورسعيد": 70,
                    "الإسماعيلية": 70, "السويس": 70, "مطروح": 95, "جنوب سيناء": 100,
                    "بني سويف": 70, "الفيوم": 70, "المنيا": 70, "أسيوط": 70,
                    "سوهاج": 70, "قنا": 70, "الأقصر": 70, "أسوان": 70,
                    "البحر الاحمر": 95
                },
                freeShippingThreshold: 2,
                unavailableGovernorates: ["شمال سيناء", "الوادي الجديد"]
            };
            populateFlashTypes();
            populateGovernoratesList();
            updatePrice();
        })
        .finally(() => {
            loadImagesForCarousel();
        });
}

// Populate flash drive types
function populateFlashTypes() {
    const flashTypeSelect = document.getElementById('flash-type');
    while (flashTypeSelect.options.length > 1) {
        flashTypeSelect.remove(1);
    }
    if (productData.flashTypes && productData.flashTypes.length > 0) {
        productData.flashTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.id;
            option.textContent = type.name;
            flashTypeSelect.appendChild(option);
        });
    }
}

// Populate governorates list
function populateGovernoratesList() {
    const governorateOptionsList = document.getElementById('governorate-options-list');
    governorateOptionsList.innerHTML = '';

    Object.keys(productData.shipping).forEach(gov => {
        const listItem = document.createElement('li');
        listItem.textContent = gov;
        listItem.dataset.value = gov;
        governorateOptionsList.appendChild(listItem);
    });

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

// Carousel Logic
let allCarouselImages = [];
let carouselInterval;

function loadImagesForCarousel() {
    const carouselContainer = document.getElementById('main-carousel');
    carouselContainer.innerHTML = '';

    for (let i = 1; i <= 4; i++) {
        allCarouselImages.push(`assets/images/flashe${i}.png`);
    }

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

    initCarousel();
}

function initCarousel() {
    const carouselItems = document.querySelectorAll('#main-carousel .carousel-item');
    if (carouselItems.length === 0) return;

    let currentCenterIndex = 0;

    function updateCarouselPositions() {
        carouselItems.forEach((item, index) => {
            item.classList.remove('back', 'left', 'center', 'right');
            item.style.display = 'none';

            let relativeIndex = index - currentCenterIndex;
            if (relativeIndex < -allCarouselImages.length / 2) relativeIndex += allCarouselImages.length;
            else if (relativeIndex > allCarouselImages.length / 2) relativeIndex -= allCarouselImages.length;

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

    btnMore.onclick = () => { moreModal.style.display = "block"; document.body.style.overflow = "hidden"; };
    moreModalClose.onclick = () => { moreModal.style.display = "none"; document.body.style.overflow = "auto"; };
    zoomModalClose.onclick = () => { zoomModal.style.display = "none"; document.body.style.overflow = "auto"; };

    deliveryUnavailableLink.onclick = (e) => {
        e.preventDefault();
        deliveryUnavailableModal.style.display = "block";
        document.body.style.overflow = "hidden";
    };
    deliveryUnavailableClose.onclick = () => { deliveryUnavailableModal.style.display = "none"; document.body.style.overflow = "auto"; };

    window.onclick = (event) => {
        if (event.target == moreModal) { moreModal.style.display = "none"; document.body.style.overflow = "auto"; }
        if (event.target == zoomModal) { zoomModal.style.display = "none"; document.body.style.overflow = "auto"; }
        if (event.target == deliveryUnavailableModal) { deliveryUnavailableModal.style.display = "none"; document.body.style.overflow = "auto"; }
    };

    document.querySelectorAll('#more-modal .modal-image').forEach(img => {
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
    const governorateToggle = document.querySelector('.governorate-toggle');
    const governorateListDiv = document.querySelector('.governorate-list');
    const multipleTypesGroup = document.getElementById('multiple-types-group');
    const multipleTypesTextarea = document.getElementById('multiple-types');
    const governorateOptionsList = document.getElementById('governorate-options-list');

    flashType.addEventListener('change', updatePrice);

    quantity.addEventListener('change', function() {
        const quantityNum = parseInt(this.value);
        if (quantityNum > 1) {
            multipleTypesGroup.style.display = 'block';
            if (!flashType.value) multipleTypesTextarea.setAttribute('required', 'required');
        } else {
            multipleTypesGroup.style.display = 'none';
            multipleTypesTextarea.removeAttribute('required');
            multipleTypesTextarea.value = '';
        }
        updatePrice();
    });

    governorateOptionsList.addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            governorateInput.value = event.target.dataset.value;
            governorateListDiv.classList.remove('active');
            updatePrice();
        }
    });

    governorateToggle.addEventListener('click', function() {
        governorateListDiv.classList.toggle('active');
        if (governorateListDiv.classList.contains('active')) {
            document.getElementById('governorate-search').focus();
            governorateOptionsList.scrollTop = 0;
        }
    });

    document.addEventListener('click', function(event) {
        const governorateDropdownContainer = document.querySelector('.governorate-dropdown');
        if (!governorateDropdownContainer.contains(event.target) && event.target !== governorateInput) {
            governorateListDiv.classList.remove('active');
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!validateForm()) return;

        const name = document.getElementById('name').value.trim();
        const flashTypeValue = flashType.value;
        const quantityValue = quantity.value;
        const phone = document.getElementById('phone').value.trim();
        const altPhone = document.getElementById('alt-phone').value.trim();
        const governorate = governorateInput.value;
        const address = document.getElementById('address').value.trim();
        const notes = document.getElementById('notes').value.trim();
        const multipleTypes = multipleTypesTextarea.value.trim();

        let flashTypeName = '';
        if (productData.flashTypes) {
            const selectedType = productData.flashTypes.find(type => type.id === flashTypeValue);
            if (selectedType) flashTypeName = selectedType.name;
        }

        const quantityNum = parseInt(quantityValue);
        let orderDetails = '';
        if (quantityNum > 1 && multipleTypes) {
            orderDetails = multipleTypes;
        } else if (quantityNum > 1 && flashTypeName) {
            orderDetails = `${quantityNum} قطعة من فلاشة ${flashTypeName}`;
        } else if (quantityNum === 1 && flashTypeName) {
            orderDetails = `فلاشة ${flashTypeName}`;
        } else {
            orderDetails = 'لم يتم تحديد نوع الفلاشة/الفلاشات';
        }

        let message = `مرحبًا، إسمي ${name}\n\n📦 الطلب:\n${orderDetails}\n\n📞 أرقام التواصل:\nرقم أساسي: ${phone}`;
        if (altPhone) message += `\nرقم بديل: ${altPhone}`;
        message += `\n\n📍 العنوان:\n${governorate} – ${address}`;
        if (notes) message += `\n\n📝 ملاحظات:\n${notes}`;
        message += `\n\n💰 إجمالي التكلفة:\n${document.getElementById('total-cost').textContent}`;

        window.open(`https://wa.me/${productData.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    });
}

function validateForm() {
    const name = document.getElementById('name').value.trim();
    const flashType = document.getElementById('flash-type').value.trim();
    const quantity = document.getElementById('quantity').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const governorate = document.getElementById('governorate-input').value.trim();
    const address = document.getElementById('address').value.trim();
    const multipleTypesTextarea = document.getElementById('multiple-types').value.trim();

    if (!name) { alert('الاسم الكامل مطلوب.'); return false; }
    if (!quantity) { alert('عدد القطع مطلوب.'); return false; }

    const quantityNum = parseInt(quantity);
    if (quantityNum === 1 && !flashType) { alert('نوع الفلاشة مطلوب عند طلب قطعة واحدة.'); return false; }
    if (quantityNum > 1 && !flashType && !multipleTypesTextarea) {
        alert('يرجى تحديد نوع الفلاشة أو تخصيص الأنواع عند طلب أكثر من قطعة.');
        return false;
    }
    if (!phone) { alert('رقم الهاتف مطلوب.'); return false; }
    if (!governorate) { alert('المحافظة مطلوبة.'); return false; }
    if (productData.unavailableGovernorates && productData.unavailableGovernorates.includes(governorate)) {
        alert(`عذرًا، لا يتوفر التوصيل إلى محافظة ${governorate}. يرجى اختيار محافظة أخرى.`);
        return false;
    }
    if (!address) { alert('العنوان بالتفصيل مطلوب.'); return false; }
    return true;
}

// Governorate search filter
function initGovernorateSearch() {
    const governorateSearch = document.getElementById('governorate-search');
    const governorateOptionsList = document.getElementById('governorate-options-list');

    governorateSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        Array.from(governorateOptionsList.getElementsByTagName('li')).forEach(item => {
            item.style.display = item.textContent.toLowerCase().includes(searchTerm) ? '' : 'none';
        });
    });
}

// Update price calculation
function updatePrice() {
    if (!productData || !productData.flashTypes || !productData.shipping) {
        resetCostDisplay();
        return;
    }

    const flashType = document.getElementById('flash-type').value;
    const quantity = document.getElementById('quantity').value;
    const governorate = document.getElementById('governorate-input').value;
    const multipleTypesTextarea = document.getElementById('multiple-types');

    const quantityNum = parseInt(quantity);
    const basePricePerUnit = productData.flashTypes[0].price;
    const discountRate = productData.discount || 0;
    const totalPriceBeforeDiscount = basePricePerUnit * quantityNum;
    const totalPriceAfterDiscount = totalPriceBeforeDiscount * (1 - discountRate);

    let shippingCost = 0;
    if (quantityNum < productData.freeShippingThreshold) {
        shippingCost = productData.shipping.hasOwnProperty(governorate) ? productData.shipping[governorate] : 0;
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
    } else {
        const selectedType = productData.flashTypes.find(type => type.id === selectedFlashTypeId);
        const flashTypeName = selectedType ? selectedType.name : (quantityNum > 1 ? 'أنواع متعددة' : 'لم يتم التحديد');
        selectedItemsText = `${quantityNum} قطعة من ${flashTypeName}`;
    }

    document.getElementById('selected-items').textContent = selectedItemsText;
    document.getElementById('unit-price').textContent = `${totalPriceBeforeDiscount.toFixed(2)} ج.م`;
    document.getElementById('discounted-price').textContent = `${totalPriceAfterDiscount.toFixed(2)} ج.م`;
    document.getElementById('shipping-cost').textContent = `${shippingCost.toFixed(2)} ج.م`;
    document.getElementById('total-cost').textContent = `${totalCost.toFixed(2)} ج.م`;
}

// Scroll animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-item, .testimonial').forEach(el => observer.observe(el));
}

// Smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({ top: targetElement.offsetTop - 100, behavior: 'smooth' });
            }
        });
    });
}
