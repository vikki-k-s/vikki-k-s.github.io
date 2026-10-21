/**
 * VIKAS K S // PROFESSIONAL ENGINEERING PORTFOLIO JAVASCRIPT ENGINE
 * Handles: Hardware Instrumentation Test Bench, Firmware Modals, Toast Notifications,
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
    // 4. HARDWARE INSTRUMENTATION TEST BENCH
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
            appendSerialLog(containerId, 'Serial buffer cleared by operator.');
        }
    };

    // -------------------------------------------------------------
    // SYSTEM 01: Automatic Street Light (LDR / ADC)
    // -------------------------------------------------------------
    const proLuxSlider = document.getElementById('proLuxSlider');
    const proLuxDisplay = document.getElementById('proLuxDisplay');
    const proVoltageVal = document.getElementById('proVoltageVal');
    const proAdcVal = document.getElementById('proAdcVal');
    const proRelayState = document.getElementById('proRelayState');
    const proPowerMode = document.getElementById('proPowerMode');
    const proStreetStatusBadge = document.getElementById('proStreetStatusBadge');
    
    // Instrumentation Meters
    const meterAdcReadout = document.getElementById('meterAdcReadout');
    const meterCompReadout = document.getElementById('meterCompReadout');
    const meterRelayReadout = document.getElementById('meterRelayReadout');
    const circuitWire = document.getElementById('circuitWire');
    const circuitWire2 = document.getElementById('circuitWire2');
    const circuitRelayBadge = document.getElementById('circuitRelayBadge');
    const circuitLoadBadge = document.getElementById('circuitLoadBadge');

    const LDR_THRESHOLD = 450;
    let prevStreetIsNight = null;

    function updateStreetLightDemo(val) {
        const voltage = ((val * 5.0) / 1023.0).toFixed(2);
        proLuxDisplay.textContent = `${val} Lux (${val < LDR_THRESHOLD ? 'Night / Dark' : 'Daylight'})`;
        proVoltageVal.textContent = `${voltage} V`;
        proAdcVal.textContent = `${val} / 1023 LSB`;
        meterAdcReadout.textContent = val;

        const isNight = val < LDR_THRESHOLD;

        if (isNight) {
            meterCompReadout.textContent = '< 450 (TRIP)';
            meterCompReadout.className = 'meter-readout highlight-green';
            meterRelayReadout.textContent = 'ENERGIZED';
            meterRelayReadout.className = 'meter-readout highlight-green';

            circuitWire.classList.add('active');
            circuitWire2.classList.add('active');
            circuitRelayBadge.classList.add('active');
            circuitRelayBadge.textContent = 'RELAY CLOSED';
            circuitLoadBadge.classList.add('active');
            circuitLoadBadge.textContent = 'LIGHTS: ACTIVE (ON)';

            proRelayState.textContent = 'HIGH (5V TTL / Relay Energized)';
            proRelayState.className = 't-value highlight-green';
            proPowerMode.textContent = 'Night Illumination (Active)';
            proPowerMode.className = 't-value highlight';
            proStreetStatusBadge.textContent = 'STATUS: NIGHT LIGHTS ACTIVE';

            if (prevStreetIsNight !== true) {
                appendSerialLog('streetSerialFeed', `ADC Pin A0 = ${val} LSB (${voltage}V) < ${LDR_THRESHOLD} -> Relay HIGH. Street illumination active.`, true);
                prevStreetIsNight = true;
            }
        } else {
            meterCompReadout.textContent = '> 450 (OK)';
            meterCompReadout.className = 'meter-readout';
            meterRelayReadout.textContent = 'DE-ENERGIZED';
            meterRelayReadout.className = 'meter-readout';

            circuitWire.classList.remove('active');
            circuitWire2.classList.remove('active');
            circuitRelayBadge.classList.remove('active');
            circuitRelayBadge.textContent = 'RELAY OPEN';
            circuitLoadBadge.classList.remove('active');
            circuitLoadBadge.textContent = 'LIGHTS: OFF';

            proRelayState.textContent = 'LOW (0V / Lamps OFF)';
            proRelayState.className = 't-value';
            proPowerMode.textContent = 'Daytime Energy Saving (Active)';
            proPowerMode.className = 't-value highlight-green';
            proStreetStatusBadge.textContent = 'STATUS: DAYLIGHT OK';

            if (prevStreetIsNight !== false) {
                appendSerialLog('streetSerialFeed', `ADC Pin A0 = ${val} LSB (${voltage}V) >= ${LDR_THRESHOLD} -> Relay LOW. Power conserved.`, false);
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
    // SYSTEM 02: Home Automation & Climate Hub
    // -------------------------------------------------------------
    const proTempSlider = document.getElementById('proTempSlider');
    const proTempValDisplay = document.getElementById('proTempValDisplay');
    const proTempVoltage = document.getElementById('proTempVoltage');
    const proAcRelayVal = document.getElementById('proAcRelayVal');
    const proFanRpmVal = document.getElementById('proFanRpmVal');
    const proHomeStatusBadge = document.getElementById('proHomeStatusBadge');

    // Meters
    const meterTempReadout = document.getElementById('meterTempReadout');
    const meterAcRelayReadout = document.getElementById('meterAcRelayReadout');
    const meterIrReadout = document.getElementById('meterIrReadout');
    const homeAcWire = document.getElementById('homeAcWire');
    const homeAcWire2 = document.getElementById('homeAcWire2');
    const homeAcRelayBadge = document.getElementById('homeAcRelayBadge');
    const homeAcLoadBadge = document.getElementById('homeAcLoadBadge');

    const TEMP_THRESHOLD = 30.0;
    let prevAcRunning = null;

    function updateTempDemo(temp) {
        const vOut = ((temp * 10) / 1000).toFixed(2);
        const mV = temp * 10;
        proTempValDisplay.textContent = `${temp}.0 °C (${temp >= TEMP_THRESHOLD ? 'Elevated Heat' : 'Normal'})`;
        proTempVoltage.textContent = `${vOut} V (${mV} mV)`;
        meterTempReadout.textContent = `${temp}.0°C`;

        const isHot = temp >= TEMP_THRESHOLD;

        if (isHot) {
            meterAcRelayReadout.textContent = 'ACTIVE';
            meterAcRelayReadout.className = 'meter-readout highlight';

            homeAcWire.classList.add('active');
            homeAcWire2.classList.add('active');
            homeAcRelayBadge.classList.add('active');
            homeAcRelayBadge.textContent = 'RELAY CLOSED';
            homeAcLoadBadge.classList.add('active');
            homeAcLoadBadge.textContent = 'AC: COOLING ACTIVE';

            proAcRelayVal.textContent = 'ACTIVATED (Pin 8 HIGH)';
            proAcRelayVal.className = 't-value highlight';
            const calcRpm = 1200 + (temp - TEMP_THRESHOLD) * 80;
            proFanRpmVal.textContent = `RUNNING (${calcRpm} RPM)`;
            proFanRpmVal.className = 't-value highlight-green';
            proHomeStatusBadge.textContent = 'CLIMATE: COOLING ACTIVE';

            if (prevAcRunning !== true) {
                appendSerialLog('homeSerialFeed', `LM35 Pin A1 = ${temp}.0°C (${vOut}V) >= ${TEMP_THRESHOLD}°C -> AC Relay K1 ENERGIZED. Fan at ${calcRpm} RPM.`, true);
                prevAcRunning = true;
            }
        } else {
            meterAcRelayReadout.textContent = 'STANDBY';
            meterAcRelayReadout.className = 'meter-readout';

            homeAcWire.classList.remove('active');
            homeAcWire2.classList.remove('active');
            homeAcRelayBadge.classList.remove('active');
            homeAcRelayBadge.textContent = 'RELAY OPEN';
            homeAcLoadBadge.classList.remove('active');
            homeAcLoadBadge.textContent = 'AC: STANDBY';

            proAcRelayVal.textContent = 'STANDBY (Temp < 30.0°C)';
            proAcRelayVal.className = 't-value';
            proFanRpmVal.textContent = 'IDLE (0 RPM)';
            proFanRpmVal.className = 't-value';
            proHomeStatusBadge.textContent = 'CLIMATE: NORMAL';

            if (prevAcRunning !== false) {
                appendSerialLog('homeSerialFeed', `LM35 Pin A1 = ${temp}.0°C (${vOut}V) < ${TEMP_THRESHOLD}°C -> AC Relay K1 DE-ENERGIZED. Thermal nominal.`, false);
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
    const proIrPinVal = document.getElementById('proIrPinVal');
    const proAlarmVal = document.getElementById('proAlarmVal');

    window.toggleProIr = function() {
        isIrActive = !isIrActive;

        if (isIrActive) {
            proIrBtnText.textContent = 'Reset Proximity Detection (Clear Beam)';
            meterIrReadout.textContent = 'TRIPPED';
            meterIrReadout.className = 'meter-readout highlight-red';

            proIrPinVal.textContent = 'LOW (0V / Active Detection)';
            proIrPinVal.className = 't-value highlight-red';
            proAlarmVal.textContent = 'ALARM ACTIVATED (Pin 9 HIGH)';
            proAlarmVal.className = 't-value highlight-red';
            appendSerialLog('homeSerialFeed', 'INTERRUPT: Digital Pin 7 LOW. Object detected in perimeter. Pin 9 alarm energized.', true);
        } else {
            proIrBtnText.textContent = 'Simulate Object / Proximity Detection';
            meterIrReadout.textContent = 'CLEAR';
            meterIrReadout.className = 'meter-readout highlight-green';

            proIrPinVal.textContent = 'HIGH (5V / Beam Clear)';
            proIrPinVal.className = 't-value highlight-green';
            proAlarmVal.textContent = 'NORMAL (Clear)';
            proAlarmVal.className = 't-value';
            appendSerialLog('homeSerialFeed', 'Pin 7: HIGH. Perimeter clear. Resumed routine background scan.', false);
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
 * PROJECT: Automatic Street Light Energy Management System
 * AUTHOR:  Vikas K S (Electronics & Communication Engineering)
 * YEAR:    2025
 * TARGET:  Microchip ATmega328P (Arduino UNO)
 * ======================================================================
 */

const int LDR_SENSOR_PIN = A0;  // Analog input pin connected to LDR voltage divider
const int RELAY_PIN      = 13;  // Digital output pin driving optoisolated relay module
const int LUX_THRESHOLD  = 450; // Calibrated daylight transition threshold (LSB)
const int HYSTERESIS     = 25;  // Digital deadband margin preventing dusk relay chatter

bool streetLightState = false;

void setup() {
  Serial.begin(9600);
  pinMode(LDR_SENSOR_PIN, INPUT);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Initialize with relay de-energized (Lamps OFF)

  Serial.println(F("[SYSTEM BOOT] Automatic Street Light Controller Online."));
}

void loop() {
  int rawLdr = analogRead(LDR_SENSOR_PIN);
  float voltage = (rawLdr * 5.0) / 1023.0;
  
  // Real-time telemetry monitoring
  Serial.print(F("ADC Reading: "));
  Serial.print(rawLdr);
  Serial.print(F(" LSB ("));
  Serial.print(voltage, 2);
  Serial.print(F("V)"));

  // State evaluation with algorithmic hysteresis
  if (!streetLightState && rawLdr < (LUX_THRESHOLD - HYSTERESIS)) {
    // Ambient light below threshold -> Switch lights ON
    digitalWrite(RELAY_PIN, HIGH);
    streetLightState = true;
    Serial.println(F(" -> [NIGHT DETECTED] Relay HIGH: Street Illumination Active"));
  } 
  else if (streetLightState && rawLdr > (LUX_THRESHOLD + HYSTERESIS)) {
    // Ambient daylight restored -> Switch lights OFF
    digitalWrite(RELAY_PIN, LOW);
    streetLightState = false;
    Serial.println(F(" -> [DAYLIGHT DETECTED] Relay LOW: Lamps OFF (Power Conserved)"));
  } 
  else {
    Serial.println(streetLightState ? F(" -> Maintaining ON") : F(" -> Maintaining OFF"));
  }

  delay(400); // 400ms non-blocking sampling delay
}`
        },
        homeAutomation: {
            title: 'smart_home_automation.ino (Arduino UNO / Embedded C)',
            code: `/**
 * ======================================================================
 * PROJECT: Smart Home Automation & Environmental Control Hub
 * AUTHOR:  Vikas K S (Electronics & Communication Engineering)
 * YEAR:    2025
 * TARGET:  Microchip ATmega328P (Arduino UNO)
 * ======================================================================
 */

const int TEMP_PIN   = A1;  // Analog input pin for LM35 Linear Temperature Sensor
const int IR_PIN     = 7;   // Digital input with internal pull-up for IR Proximity Sensor
const int AC_RELAY   = 8;   // Digital output pin driving AC Cooling Relay
const int ALARM_PIN  = 9;   // Digital output pin driving Security Alert Indicator

const float TEMP_SETPOINT = 30.0; // Trigger smart cooling when temperature >= 30.0 deg C

void setup() {
  Serial.begin(9600);
  pinMode(IR_PIN, INPUT_PULLUP);
  pinMode(AC_RELAY, OUTPUT);
  pinMode(ALARM_PIN, OUTPUT);

  digitalWrite(AC_RELAY, LOW);
  digitalWrite(ALARM_PIN, LOW);

  Serial.println(F("[SYSTEM BOOT] Home Automation & Climate Hub Initialized."));
}

void loop() {
  // 1. Temperature Calculation from LM35 Linear Output (10mV / deg C)
  int adcValue = analogRead(TEMP_PIN);
  float voltage = (adcValue * 5.0) / 1024.0;
  float currentTemp = voltage * 100.0; // Scale 10mV/deg C to Celsius

  Serial.print(F("Temperature: "));
  Serial.print(currentTemp, 1);
  Serial.print(F(" deg C | "));

  // Smart HVAC closed-loop regulation logic
  if (currentTemp >= TEMP_SETPOINT) {
    digitalWrite(AC_RELAY, HIGH);
    Serial.print(F("AC Relay: [ACTIVE] | "));
  } else {
    digitalWrite(AC_RELAY, LOW);
    Serial.print(F("AC Relay: [STANDBY] | "));
  }

  // 2. Infrared proximity & security detection logic
  int irState = digitalRead(IR_PIN);
  if (irState == LOW) { // Active-LOW on reflected IR beam detection
    digitalWrite(ALARM_PIN, HIGH);
    Serial.println(F("Security: [OBJECT DETECTED IN PERIMETER]"));
  } else {
    digitalWrite(ALARM_PIN, LOW);
    Serial.println(F("Security: [PERIMETER CLEAR]"));
  }

  delay(400); // 400ms sampling cycle
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
            formFeedback.innerHTML = `&check; Thank you, <strong>${name}</strong>. Opening your mail client to transmit your inquiry...`;

            showToast('Preparing inquiry transmission.');

            setTimeout(() => {
                const mailtoLink = `mailto:shivuvikas007@gmail.com?subject=${encodeURIComponent('[Engineering Inquiry] ' + subject)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;
                window.location.href = mailtoLink;
            }, 800);
        });
    }

    console.log('%c[Vikas K S // Professional Engineering Portfolio Online]', 'color: #38bdf8; font-weight: bold; font-size: 13px;');
});
