document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.getElementById('topic-table-body');
    
    const topics = await fetch('/topics.json').then(res => res.json());
    
    // dummy selected data (replace with Firebase later)
    const selected = {
      "1": { name: "Sreya Saju", class: "12B", adminNo: "12343" },
      "5": { name: "John Doe", class: "11B", adminNo: "21147" }
    };
  
    const colorMap = {
        environment: "is-success",
        technology: "is-info",
        health: "is-danger",
        physics: "is-primary",
        chemistry: "is-primary",
        sustainability: "is-warning",
        biology: "is-link"
    };
    
    function renderTable(filter = "all") {
        tableBody.innerHTML = ""; 
    
        topics.forEach((topic, index) => {
          const sel = selected[topic.id];
          const isSelected = !!sel;
    
          if (
            (filter === "Selected" && !isSelected) ||
            (filter === "Available" && isSelected)
          ) {
            return;
          }
    
          const tr = document.createElement('tr');
          const normalizedSubject = topic.subject.trim().toLowerCase();
          const subjectColor = colorMap[normalizedSubject] || "is-light";
    
          tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${topic.name}</td>
            <td><span class="tag ${subjectColor}">${topic.subject}</span></td>
            <td>
              ${
                sel
                  ? `
                <div class="bubble-wrapper">
                  <span class="tag is-dark">Selected</span>
                  <div class="info-bubble">
                    ${sel.name}<br>${sel.class}<br>${sel.adminNo}
                  </div>
                </div>`
                  : `<span class="tag is-light">Available</span>`
              }
            </td>
          `;
    
          tableBody.appendChild(tr);
        });
      }
    
      // Initial render
      renderTable("all");
    
      // Filter button event listeners
      document.getElementById("filter-all").addEventListener("click", () => renderTable("All"));
      document.getElementById("filter-selected").addEventListener("click", () => renderTable("Selected"));
      document.getElementById("filter-available").addEventListener("click", () => renderTable("Available"));
    });