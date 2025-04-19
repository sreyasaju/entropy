document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.getElementById('topic-table-body');
  
    const topics = await fetch('/topics.json').then(res => res.json());
  
    // dummy selected data (replace with Firebase later)
    const selected = {
      "1": { name: "Sreya Saju", class: "12B", adminNo: "12343" },
      "5": { name: "John Doe", class: "11B", adminNo: "21147" }
    };

    const colorMap = {
        Environment: "is-success",
        Technology: "is-info",
        Health: "is-danger",
        Physics: "is-primary",
        Chemistry: "is-primary",
        Sustainability: "is-warning"
      };
      
    const subject = topic.subject;
    const subjectColor = colorMap[subject] || "is-light";

    topics.forEach((topic, index) => {
      const sel = selected[topic.id];
      const tr = document.createElement('tr');
  
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${topic.name}</td>
        <td><span class="tag ${subjectColor}">${subject}</span></td>
        <td>
          ${
            sel
              ? `
            <div class="bubble-wrapper">
              <span class="tag is-success">Selected</span>
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
  });