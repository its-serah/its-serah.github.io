// Three.js Dice Animation
let scene, camera, renderer, dice;
let isRolling = false;

function initThreeJS() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(400, 400);
    document.getElementById('dice-container').appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);
    
    // Create dice geometry
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    
    // Create materials with different colors for each face
    const materials = [
        new THREE.MeshPhongMaterial({ color: 0xff6b6b }), // Red
        new THREE.MeshPhongMaterial({ color: 0x4ecdc4 }), // Teal
        new THREE.MeshPhongMaterial({ color: 0x45b7d1 }), // Blue
        new THREE.MeshPhongMaterial({ color: 0xf9ca24 }), // Yellow
        new THREE.MeshPhongMaterial({ color: 0x6c5ce7 }), // Purple
        new THREE.MeshPhongMaterial({ color: 0xa29bfe })  // Light Purple
    ];
    
    dice = new THREE.Mesh(geometry, materials);
    scene.add(dice);
    
    // Start animation loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    if (!isRolling) {
        // Gentle rotation when not rolling
        dice.rotation.x += 0.01;
        dice.rotation.y += 0.01;
    }
    
    renderer.render(scene, camera);
}

function rollDice() {
    if (isRolling) return;
    
    isRolling = true;
    
    // Random rotation values
    const targetRotation = {
        x: Math.random() * Math.PI * 4 + Math.PI * 4,
        y: Math.random() * Math.PI * 4 + Math.PI * 4,
        z: Math.random() * Math.PI * 4 + Math.PI * 4
    };
    
    const startRotation = {
        x: dice.rotation.x,
        y: dice.rotation.y,
        z: dice.rotation.z
    };
    
    let progress = 0;
    
    function updateRotation() {
        if (progress < 1) {
            progress += 0.02;
            
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            dice.rotation.x = startRotation.x + (targetRotation.x - startRotation.x) * easeProgress;
            dice.rotation.y = startRotation.y + (targetRotation.y - startRotation.y) * easeProgress;
            dice.rotation.z = startRotation.z + (targetRotation.z - startRotation.z) * easeProgress;
            
            requestAnimationFrame(updateRotation);
        } else {
            isRolling = false;
            
            // Determine which face is up and trigger action
            const faceUp = determineFaceUp();
            handleDiceResult(faceUp);
        }
    }
    
    updateRotation();
}

function determineFaceUp() {
    // Simplified face detection - in a real implementation, 
    // you'd calculate which face normal is most aligned with up vector
    return Math.floor(Math.random() * 2); // 0 for academia, 1 for recruiter
}

function handleDiceResult(result) {
    const message = result === 0 ? 
        "Welcome to my academic journey!" : 
        "Let's explore my professional experience!";
    
    // Show result message
    const resultDiv = document.getElementById('dice-result');
    resultDiv.textContent = message;
    resultDiv.style.opacity = '1';
    
    setTimeout(() => {
        resultDiv.style.opacity = '0';
    }, 3000);
    
    // Update content visibility based on result
    updateContentVisibility(result);
}

function updateContentVisibility(mode) {
    const academicSections = document.querySelectorAll('.academic-content');
    const professionalSections = document.querySelectorAll('.professional-content');
    
    if (mode === 0) {
        // Show academic content
        academicSections.forEach(section => section.style.display = 'block');
        professionalSections.forEach(section => section.style.display = 'none');
    } else {
        // Show professional content
        academicSections.forEach(section => section.style.display = 'none');
        professionalSections.forEach(section => section.style.display = 'block');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add dice container to the page
    const diceSection = document.createElement('div');
    diceSection.id = 'dice-section';
    diceSection.innerHTML = `
        <div id="dice-container"></div>
        <button id="roll-dice-btn" class="option-button">Roll the Dice!</button>
        <div id="dice-result"></div>
    `;
    
    // Insert after buttons
    const buttonContainer = document.querySelector('.button-container');
    buttonContainer.insertAdjacentElement('afterend', diceSection);
    
    // Initialize Three.js
    initThreeJS();
    
    // Add event listeners
    document.getElementById('roll-dice-btn').addEventListener('click', rollDice);
    
    // Original button functionality
    document.getElementById('academia-btn').addEventListener('click', () => {
        updateContentVisibility(0);
    });
    
    document.getElementById('recruiter-btn').addEventListener('click', () => {
        updateContentVisibility(1);
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(400, 400);
    }
});
