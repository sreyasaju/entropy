document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.getElementById('ss-topic-table-body');
  
    const topics = await fetch('/topics.json').then(res => res.json());
  
    const unavailable = {
      "3": { name: "Sreya Saju", class: "12", section: "B", adminNo: "12343" },
      "5": { name: "John Doe", class: "11", section: "B", adminNo: "21147" }
    };
  
    // color mapping
    const colorMap = {
      environment: "is-success",
      technology: "is-info",
      health: "is-danger",
      physics: "is-primary",
      chemistry: "is-primary",
      sustainability: "is-warning",
      biology: "is-link"
    };
    
    // Modal box
    const modal = document.getElementById("ss-select-modal");
    let currentTopicID = null;

    // Open the modal
    function openModal(topicID) {
        currentTopicID = topicID;
        modal.classList.add("is-active");
    }

    function closeModal() {
        modal.classList.remove("is-active");
        currentTopicID = null;
    }
    
    document.querySelector("#ss-cancel-selection").addEventListener("click", closeModal);
    document.querySelector("#ss-select-modal .delete").addEventListener("click", closeModal);



    function renderTable(filter = "all") {
        tableBody.innerHTML = "";

        topics.forEach((topic, index) => {
            const sel = unavailable[topic.id];
            const isUnavailable = !!sel; // if the topic is unavailable

            if (
                (filter === "Unavailable" && !isUnavailable) || 
                (filter === "Available" && isUnavailable)
            ) {
                return;
            }

            const tr = document.createElement('tr');
            const normalizedSubject = topic.subject.trim().toLowerCase();
            const subjectColor = colorMap[normalizedSubject] || "is-light";

            let statusTag = "";

            if (isUnavailable) { // topic is unavailable
                statusTag = `
                    <div class="bubble-wrapper">
                        <span class="tag is-light is-medium">Unavailable</span>
                        <div class="info-bubble">
                            ${sel.name}<br>${sel.class}-${sel.section}<br>${sel.adminNo}
                        </div>
                    </div>`;
            } else { // topic is available
                statusTag = `<span class="tag is-dark is-medium">Available</span>`;
                tr.addEventListener("click", () => {
                    openModal(topic.id);
                });
                tr.style.cursor = "pointer";
            }

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${topic.name}</td>
                <td><span class="tag is- ${subjectColor}">${topic.subject}</span></td>
                <td>${statusTag}</td>
            `;

            tableBody.appendChild(tr);
        });
    }

    renderTable("all");

    document.getElementById("ss-filter-all").addEventListener("click", () => renderTable("all"));
    document.getElementById("ss-filter-unavailable").addEventListener("click", () => renderTable("Unavailable"));
    document.getElementById("ss-filter-available").addEventListener("click", () => renderTable("Available"));

   
    const submitButton = document.getElementById("ss-submit-selection");
    submitButton.addEventListener("click", async () => {
        const studentName = document.getElementById("ss-student-name").value;
        const studentClass = document.getElementById("student-class").value;
        const studentSection = document.getElementById("student-section").value;
        const studentAdmin = document.getElementById("ss-student-admin").value;

        // Check if all fields are filled
        if (!studentName || !studentClass || !studentSection || !studentAdmin) {
            alert("Please fill in all the fields.");
            return;
        }

        // Save to Firebase Firestore
        try {
            const docRef = await addDoc(collection(db, "topicSelections"), {
                topicID: currentTopicID,
                studentName: studentName,
                studentClass: studentClass,
                studentSection: studentSection,
                studentAdmin: studentAdmin,
                timestamp: new Date(),
            });
            console.log("Document written with ID: ", docRef.id);

           
            closeModal();
        } catch (e) {
            console.error("Error adding document: ", e);
            alert("Failed to submit. Please try again.");
        }
    });
});