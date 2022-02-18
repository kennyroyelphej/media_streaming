const socket = io('/')

const form = document.querySelector("form");
const fileInput = document.querySelector(".file-input");
const progressArea = document.querySelector(".progress-area");
const uploadedArea = document.querySelector(".uploaded-area");
const encodedArea = document.querySelector(".encoded-area");

form.addEventListener("click", () => { fileInput.click() });

fileInput.onchange = ({ target }) => {
    let file = target.files[0];
    if (file) {
        let fileName = file.name;
        if (fileName.length >= 12) {
            let splitName = fileName.split('.');
            fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
        }
        uploadFile(fileName, file);
    }
}

function uploadFile(name, file) {

    let fileLoaded; let fileTotal; let fileSize;
    let xhr = new XMLHttpRequest();

    xhr.open("POST", "http://localhost:3005/content/upload");

    xhr.upload.addEventListener("progress", ({ loaded, total }) => {
        fileLoaded = Math.floor((loaded / total) * 100);
        fileTotal = Math.floor(total / 1000);
        (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024 * 1024)).toFixed(2) + " MB";
        let progressHTML = `<li class="row">
                                    <i class="fas fa-film"></i>
                                    <div class="content">
                                        <div class="details">
                                        <span class="name">${name} • Uploading</span>
                                        <span class="percent">${fileLoaded}%</span>
                                        </div>
                                        <div class="progress-bar">
                                        <div class="progress" style="width: ${fileLoaded}%"></div>
                                        </div>
                                    </div>
                                    </li>`;
        uploadedArea.classList.add("onprogress");
        progressArea.innerHTML = progressHTML;
    });

    xhr.addEventListener("load", (complete) => {
        let response = JSON.parse(xhr.responseText)
        if (response.success) {
            progressArea.innerHTML = "";
            let uploadedHTML = `<li class="row">
                                    <div class="content upload">
                                    <i class="fas fa-film"></i>
                                        <div class="details">
                                            <span class="name">${name} • Uploaded</span>
                                            <span class="size">${fileSize}</span>
                                        </div>
                                    </div>
                                    <i class="fas fa-check"></i>
                                </li>`;
            uploadedArea.classList.remove("onprogress");
            uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
            encodeFile(response.encoder, name, fileSize)
        }
        else {
            progressArea.innerHTML = "";
            let failedHTML = `<li class="row">
                                    <div class="content upload">
                                    <i class="fas fa-film"></i>
                                    <div class="details">
                                        <span class="name">${name}</span>
                                        <span class="name">• ${response.errMessage}</span>
                                        <span class="size">${fileSize}</span>
                                    </div>
                                    </div>
                                    <i class="fas fa-times"></i>
                                </li>`;
            uploadedArea.classList.remove("onprogress");
            uploadedArea.insertAdjacentHTML("afterbegin", failedHTML);
        }
    })

    let data = new FormData();
    let tempJson = { name: 'Volkswagen GTI Review' }
    data.append('file', file)
    data.append('data', JSON.stringify(tempJson))
    xhr.send(data);

}
function encodeFile(id, name, fileSize) {
    socket.emit('join', id)
    let dispProgress = 0
    socket.on('progress', (progress) => {
        dispProgress = Math.ceil(progress.percent)
        progressArea.innerHTML = "";
        let progressHTML = `<li class="row">
                                    <i class="fas fa-film"></i>
                                    <div class="content">
                                        <div class="details">
                                        <span class="name">${name} • Encoding</span>
                                        <span class="percent">${dispProgress}%</span>
                                        </div>
                                        <div class="progress-bar">
                                            <div class="progress" style="width: ${dispProgress}%"></div>
                                        </div>
                                    </div>
                                    </li>`;
        encodedArea.classList.add("onprogress");
        progressArea.innerHTML = progressHTML;
    })

    socket.on('complete', () => {
        progressArea.innerHTML = "";
        let progressHTML = `<li class="row">
                                    <i class="fas fa-film"></i>
                                    <div class="content">
                                        <div class="details">
                                        <span class="name">${name} • Encoded</span>
                                        </div>
                                    </div>
                                    <i class="fas fa-check"></i>
                                    </li>`;
        encodedArea.classList.remove("onprogress");
        encodedArea.insertAdjacentHTML("afterbegin", progressHTML);
        progressArea.innerHTML = progressHTML;
    })

    socket.on('error', () => {
        progressArea.innerHTML = "";
        let progressHTML = `<li class="row">
                            <div class="content upload">
                            <i class="fas fa-film"></i>
                            <div class="details">
                                <span class="name">${name}</span>
                                <span class="name">• Encoding Failed</span>
                            </div>
                            </div>
                            <i class="fas fa-times"></i>
                            </li>`;
        encodedArea.classList.remove("onprogress");
        encodedArea.insertAdjacentHTML("afterbegin", progressHTML);
        progressArea.innerHTML = progressHTML;
    })
}
