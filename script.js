/**
 * VIKAS K S // PROFESSIONAL ENGINEERING PORTFOLIO JAVASCRIPT ENGINE
 * Handles: Hardware Logic Test Bench, Firmware Modal, Toast Notifications,
 * Clipboard Copy, Serial UART Simulation, and Responsive Navigation.
 */

document.addEventListener('DOMContentLoaded', () => {

    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // ===================================================================
    // 1. MOBILE NAVIGATION & SCROLLSPY
    // ===================================================================
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-open');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('mobile-open');
            });
        });
    }

    // Active Scrollspy
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');

    window.addEventListener('scroll', () => {
        let currentId = '';
        const scrollPosition = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
            }
        });
    });


    // ===================================================================
    // 2. RESUME DOWNLOAD / PRINT HANDLER
    // ===================================================================
    const downloadCvBtn = document.getElementById('downloadCvBtn');
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', () => {
            window.print();
        });
    }

    const profileContactBtn = document.getElementById('profileContactBtn');
    if (profileContactBtn) {
        profileContactBtn.addEventListener('click', () => {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            document.getElementById('cName').focus();
        });
    }


    // ===================================================================
    // 3. TOAST NOTIFICATION SYSTEM
    // ===================================================================
    const toastWrapper = document.getElementById('toastWrapper');

    function showToast(message) {
        if (!toastWrapper) return;
        const toast = document.createElement('div');
        toast.className = 'pro-toast';
        toast.innerHTML = `<i data-lucide="check-circle" style="color:var(--success)"></i><span>${message}</span>`;
        toastWrapper.appendChild(toast);

        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(40px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    window.showToast = showToast;

    // Clipboard Copy Buttons
    document.querySelectorAll('[data-copy]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy');
            if (navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast(`Copied "${textToCopy}" to clipboard.`);
                });
            }
        });
    });


    // ===================================================================
    // 4. HARDWARE LOGIC TEST BENCH (PROTOTYPE BENCH)
    // ===================================================================
    
    // Tab Switching
    window.switchDemoTab = function(tabKey) {
        const tabStreetBtn = document.getElementById('tabStreetLightBtn');
        const tabHomeBtn = document.getElementById('tabHomeAutoBtn');
        const panelStreet = document.getElementById('demoPanelStreetLight');
        const panelHome = document.getElementById('demoPanelHomeAuto');

        if (tabKey === 'streetLight') {
            tabStreetBtn.classList.add('active');
            tabHomeBtn.classList.remove('active');
            panelStreet.classList.add('active');
            panelHome.classList.remove('active');
        } else {
            tabStreetBtn.classList.remove('active');
            tabHomeBtn.classList.add('active');
            panelStreet.classList.remove('active');
            panelHome.classList.add('active');
        }
    };

    // Helper: append serial log
    function appendSerialLog(containerId, text, isHighlight = false) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const entry = document.createElement('div');
        entry.className = 'log-entry' + (isHighlight ? ' active-log' : '');
        const time = (performance.now() / 1000).toFixed(3);
        entry.textContent = `[${time}s] ${text}`;
        container.appendChild(entry);
        container.scrollTop = container.scrollHeight;
    }

    window.clearSerialFeed = function(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
            appendSerialLog(containerId, 'Serial buffer cleared by user.');
        }
    };

    // -------------------------------------------------------------
    // PROTOTYPE 1: Automatic Street Light (LDR)
    // -------------------------------------------------------------
    const proLuxSlider = document.getElementById('proLuxSlider');
    const proLuxDisplay = document.getElementById('proLuxDisplay');
    const proAdcVal = document.getElementById('proAdcVal');
    const proRelayState = document.getElementById('proRelayState');
    const proPowerMode = document.getElementById('proPowerMode');
    const proSkyBg = document.getElementById('proSkyBg');
    const proCelestial = document.getElementById('proCelestial');
    const proLamp1 = document.querySelector('.fixture-1');
    const proLamp2 = document.querySelector('.fixture-2');
    const proStreetStatusBadge = document.getElementById('proStreetStatusBadge');
    const LDR_THRESHOLD = 450;
    let prevStreetIsNight = null;

    function updateStreetLightDemo(val) {
        proLuxDisplay.textContent = `${val} Lux (${val < LDR_THRESHOLD ? 'Night / Dark' : 'Daylight'})`;
        proAdcVal.textContent = `${val} / 1023`;

        const isNight = val < LDR_THRESHOLD;

        if (isNight) {
            proSkyBg.classList.add('night');
            proCelestial.className = 'celestial-disc moon';
            proLamp1.classList.add('lit');
            proLamp2.classList.add('lit');
            proRelayState.textContent = 'HIGH (5V Actuated / Lamps ON)';
            proRelayState.className = 't-value highlight-green';
            proPowerMode.textContent = 'Active (Night Illumination)';
            proPowerMode.className = 't-value highlight';
            proStreetStatusBadge.textContent = 'STATUS: NIGHT LIGHTS ACTIVE';

            if (prevStreetIsNight !== true) {
                appendSerialLog('streetSerialFeed', `ADC Pin A0 = ${val} (< ${LDR_THRESHOLD}) -> Relay Actuated HIGH. Street lights illuminated.`, true);
                prevStreetIsNight = true;
            }
        } else {
            proSkyBg.classList.remove('night');
            proCelestial.className = 'celestial-disc sun';
            proLamp1.classList.remove('lit');
            proLamp2.classList.remove('lit');
            proRelayState.textContent = 'LOW (0V / Lamps OFF)';
            proRelayState.className = 't-value';
            proPowerMode.textContent = 'Active (Daytime Saving)';
            proPowerMode.className = 't-value highlight-green';
            proStreetStatusBadge.textContent = 'STATUS: DAYLIGHT OK';

            if (prevStreetIsNight !== false) {
                appendSerialLog('streetSerialFeed', `ADC Pin A0 = ${val} (>= ${LDR_THRESHOLD}) -> Relay Deactivated LOW. Conserving power.`, false);
                prevStreetIsNight = false;
            }
        }
    }

    if (proLuxSlider) {
        proLuxSlider.addEventListener('input', (e) => {
            updateStreetLightDemo(parseInt(e.target.value));
        });
    }

    window.setLuxPreset = function(val) {
        if (proLuxSlider) {
            proLuxSlider.value = val;
            updateStreetLightDemo(val);
        }
    };

    // -------------------------------------------------------------
    // PROTOTYPE 2: Smart Home Automation (Temp + IR)
    // -------------------------------------------------------------
    const proTempSlider = document.getElementById('proTempSlider');
    const proTempValDisplay = document.getElementById('proTempValDisplay');
    const proAcBox = document.getElementById('proAcBox');
    const proAcTempDisplay = document.getElementById('proAcTempDisplay');
    const proAcModeTag = document.getElementById('proAcModeTag');
    const proAcFan = document.getElementById('proAcFan');
    const proAcRelayVal = document.getElementById('proAcRelayVal');
    const proFanRpmVal = document.getElementById('proFanRpmVal');
    const proHomeStatusBadge = document.getElementById('proHomeStatusBadge');
    const TEMP_THRESHOLD = 30.0;
    let prevAcRunning = null;

    function updateTempDemo(temp) {
        proTempValDisplay.textContent = `${temp}.0 °C (${temp >= TEMP_THRESHOLD ? 'High Heat' : 'Comfort Range'})`;
        proAcTempDisplay.textContent = `${temp}.0°C`;

        const isHot = temp >= TEMP_THRESHOLD;

        if (isHot) {
            proAcBox.classList.add('active');
            proAcFan.classList.add('spinning');
            proAcModeTag.textContent = 'COOLING ACTIVE';
            proAcRelayVal.textContent = 'ACTIVATED (Pin 8 HIGH)';
            proAcRelayVal.className = 't-value highlight';
            const calcRpm = 1200 + (temp - TEMP_THRESHOLD) * 80;
            proFanRpmVal.textContent = `${calcRpm} RPM (Cooling)`;
            proFanRpmVal.className = 't-value highlight-green';
            proHomeStatusBadge.textContent = 'CLIMATE: COOLING ACTIVE';

            if (prevAcRunning !== true) {
                appendSerialLog('homeSerialFeed', `LM35 Sensor = ${temp}.0°C (>= ${TEMP_THRESHOLD}°C) -> AC Relay HIGH. Fan actuated at ${calcRpm} RPM.`, true);
                prevAcRunning = true;
            }
        } else {
            proAcBox.classList.remove('active');
            proAcFan.classList.remove('spinning');
            proAcModeTag.textContent = 'STANDBY';
            proAcRelayVal.textContent = 'STANDBY (Temp < 30°C)';
            proAcRelayVal.className = 't-value';
            proFanRpmVal.textContent = '0 RPM (Idle)';
            proFanRpmVal.className = 't-value';
            proHomeStatusBadge.textContent = 'CLIMATE: NORMAL';

            if (prevAcRunning !== false) {
                appendSerialLog('homeSerialFeed', `LM35 Sensor = ${temp}.0°C (< ${TEMP_THRESHOLD}°C) -> AC Relay LOW. Temperature normal.`, false);
                prevAcRunning = false;
            }
        }
    }

    if (proTempSlider) {
        proTempSlider.addEventListener('input', (e) => {
            updateTempDemo(parseInt(e.target.value));
        });
    }

    // IR Proximity Trigger
    let isIrActive = false;
    const proIrBtnText = document.getElementById('proIrBtnText');
    const proIrLine = document.getElementById('proIrLine');
    const proIrTarget = document.getElementById('proIrTarget');
    const proIrPinVal = document.getElementById('proIrPinVal');
    const proAlarmVal = document.getElementById('proAlarmVal');

    window.toggleProIr = function() {
        isIrActive = !isIrActive;

        if (isIrActive) {
            proIrBtnText.textContent = 'Clear Proximity Beam';
            proIrLine.classList.add('tripped');
            proIrTarget.classList.add('visible');
            proIrPinVal.textContent = 'LOW (0V / Obstacle Tripped)';
            proIrPinVal.className = 't-value highlight-red';
            proAlarmVal.textContent = 'ALARM ACTIVATED (Pin 9 HIGH)';
            proAlarmVal.className = 't-value highlight-red';
            appendSerialLog('homeSerialFeed', 'IR PIN 7 INTERRUPT: Obstacle in proximity. Alert buzzer actuated on Pin 9.', true);
        } else {
            proIrBtnText.textContent = 'Simulate Object / Proximity Trip';
            proIrLine.classList.remove('tripped');
            proIrTarget.classList.remove('visible');
            proIrPinVal.textContent = 'HIGH (5V / Beam Clear)';
            proIrPinVal.className = 't-value highlight-green';
            proAlarmVal.textContent = 'NORMAL (No Obstacle)';
            proAlarmVal.className = 't-value';
            appendSerialLog('homeSerialFeed', 'IR PIN 7: Beam cleared. Normal proximity scan resumed.', false);
        }
    };


    // ===================================================================
    // 5. FIRMWARE CODE MODAL
    // ===================================================================
    const firmwareModal = document.getElementById('firmwareModal');
    const firmwareModalTitle = document.getElementById('firmwareModalTitle');
    const firmwareCodeContent = document.getElementById('firmwareCodeContent');
    const copyFirmwareBtn = document.getElementById('copyFirmwareBtn');

    const firmwareLibrary = {
        streetLight: {
            title: 'automatic_street_light.ino (Arduino UNO / Embedded C)',
            code: `/**
 * ======================================================================
 * PROJECT: Automatic Street Light Using Arduino UNO Controller
 * AUTHOR:  Vikas K S (Electronics & Communication Engineering)
 * YEAR:    2025
 * ======================================================================
 */

const int LDR_SENSOR_PIN = A0;  // Analog pin connected to LDR voltage divider
const int RELAY_PIN      = 13;  // Digital output pin driving Relay Module
const int LUX_THRESHOLD  = 450; // Calibrated daylight transition threshold
const int HYSTERESIS     = 25;  // Deadband margin to prevent dusk relay chatter

bool streetLightState = false;

void setup() {
  Serial.begin(9600);
  pinMode(LDR_SENSOR_PIN, INPUT);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Initialize with lamps off

  Serial.println(F("[INITIALIZED] Automatic Street Light Controller Online."));
}

void loop() {
  int rawLdr = analogRead(LDR_SENSOR_PIN);
  
  // Real-time serial monitoring
  Serial.print(F("ADC Reading: "));
  Serial.print(rawLdr);

  // State evaluation with hysteresis
  if (!streetLightState && rawLdr < (LUX_THRESHOLD - HYSTERESIS)) {
    // Ambient light below threshold -> Switch lights ON
    digitalWrite(RELAY_PIN, HIGH);
    streetLightState = true;
    Serial.println(F(" -> [NIGHT DETECTED] Relay HIGH: Lamps ON"));
  } 
  else if (streetLightState && rawLdr > (LUX_THRESHOLD + HYSTERESIS)) {
    // Ambient light restored -> Switch lights OFF
    digitalWrite(RELAY_PIN, LOW);
    streetLightState = false;
    Serial.println(F(" -> [DAYLIGHT DETECTED] Relay LOW: Lamps OFF (Power Saved)"));
  } 
  else {
    Serial.println(streetLightState ? F(" -> Maintaining ON") : F(" -> Maintaining OFF"));
  }

  delay(400); // 400ms sampling delay
}`
        },
        homeAutomation: {
            title: 'smart_home_automation.ino (Arduino UNO / Embedded C)',
            code: `/**
 * ======================================================================
 * PROJECT: Smart Home Automation Using Arduino UNO Controller
 * AUTHOR:  Vikas K S (Electronics & Communication Engineering)
 * YEAR:    2025
 * ======================================================================
 */

const int TEMP_PIN   = A1;  // Analog pin for LM35 Temperature Sensor
const int IR_PIN     = 7;   // Digital input with internal pull-up for IR Sensor
const int AC_RELAY   = 8;   // Digital output controlling AC Cooling Relay
const int ALARM_PIN  = 9;   // Digital output driving Security Buzzer / Indicator

const float TEMP_SETPOINT = 30.0; // Trigger smart cooling at >= 30.0°C

void setup() {
  Serial.begin(9600);
  pinMode(IR_PIN, INPUT_PULLUP);
  pinMode(AC_RELAY, OUTPUT);
  pinMode(ALARM_PIN, OUTPUT);

  digitalWrite(AC_RELAY, LOW);
  digitalWrite(ALARM_PIN, LOW);

  Serial.println(F("[INITIALIZED] Home Automation & Climate Hub Online."));
}

void loop() {
  // 1. Calculate temperature in Celsius from LM35 ADC reading
  int adcValue = analogRead(TEMP_PIN);
  float voltage = (adcValue * 5.0) / 1024.0;
  float currentTemp = voltage * 100.0; // LM35: 10mV/°C

  Serial.print(F("Room Temp: "));
  Serial.print(currentTemp, 1);
  Serial.print(F(" °C | "));

  // Smart AC thermal regulation logic
  if (currentTemp >= TEMP_SETPOINT) {
    digitalWrite(AC_RELAY, HIGH);
    Serial.print(F("AC Relay: [ACTIVE] | "));
  } else {
    digitalWrite(AC_RELAY, LOW);
    Serial.print(F("AC Relay: [STANDBY] | "));
  }

  // 2. Infrared proximity detection logic
  int irState = digitalRead(IR_PIN);
  if (irState == LOW) { // Active LOW when obstacle reflects IR beam
    digitalWrite(ALARM_PIN, HIGH);
    Serial.println(F("Security: [OBSTACLE IN PERIMETER]"));
  } else {
    digitalWrite(ALARM_PIN, LOW);
    Serial.println(F("Security: [ALL CLEAR]"));
  }

  delay(400); // 400ms sensor polling cycle
}`
        }
    };

    window.openFirmwareModal = function(key) {
        const item = firmwareLibrary[key];
        if (item && firmwareModal) {
            firmwareModalTitle.textContent = item.title;
            firmwareCodeContent.textContent = item.code;
            firmwareModal.classList.add('active');
        }
    };

    window.closeFirmwareModal = function() {
        if (firmwareModal) {
            firmwareModal.classList.remove('active');
        }
    };

    if (firmwareModal) {
        firmwareModal.addEventListener('click', (e) => {
            if (e.target === firmwareModal) {
                closeFirmwareModal();
            }
        });
    }

    if (copyFirmwareBtn) {
        copyFirmwareBtn.addEventListener('click', () => {
            if (navigator.clipboard && firmwareCodeContent) {
                navigator.clipboard.writeText(firmwareCodeContent.textContent).then(() => {
                    showToast('Source code copied to clipboard.');
                });
            }
        });
    }


    // ===================================================================
    // 6. CONTACT FORM DISPATCH
    // ===================================================================
    const proContactForm = document.getElementById('proContactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (proContactForm) {
        proContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('cName').value;
            const email = document.getElementById('cEmail').value;
            const subject = document.getElementById('cSubject').value;
            const message = document.getElementById('cMessage').value;

            formFeedback.className = 'form-feedback success';
            formFeedback.innerHTML = `&check; Thank you, <strong>${name}</strong>. Opening your default mail client to transmit your message...`;

            showToast('Message inquiry prepared.');

            setTimeout(() => {
                const mailtoLink = `mailto:shivuvikas007@gmail.com?subject=${encodeURIComponent('[Portfolio Inquiry] ' + subject)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;
                window.location.href = mailtoLink;
            }, 800);
        });
    }

    console.log('%c[Vikas K S // Professional Engineering Portfolio Online]', 'color: #38bdf8; font-weight: bold; font-size: 13px;');
});
