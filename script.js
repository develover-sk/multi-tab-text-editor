const closeBtn = document.querySelector('#close'); //close button
const minimizeBtn = document.querySelector('#minimize'); //minimize button to minimize and restore
const maxResBtn = document.querySelector('#max-res'); //maximize and restore button to go fullscreen and exit fullscreen
const tabContainer = document.querySelector('.tab-container'); //tab container to insert new tab
const closeTab = document.querySelector('.close-tab'); //close tab button to close single tab
const tabs = document.querySelector('.tabs'); ////tab parent container to attach event handler for new tab function and close tab function using event delegation

//count to total tab to add id name using sequence and check total tab present after closing each individual tab to stop last single tab from being close;
let totalTab = (totalTabCount = 1);
// to track the state of window minimized or maximized
let isMinimized = 0;
//to track the state of fullscreen status without using browser API.
let isFullScreen = 0;

//event handler to constrol window functions
closeBtn.addEventListener('mouseover', () => {
  closeBtn.innerText = '×';
});
closeBtn.addEventListener('mouseout', () => {
  closeBtn.innerText = '';
});
minimizeBtn.addEventListener('mouseover', () => {
  minimizeBtn.innerText = '-';
});
minimizeBtn.addEventListener('mouseout', () => {
  minimizeBtn.innerText = '';
});
maxResBtn.addEventListener('mouseover', () => {
  maxResBtn.innerText = '⧠';
});
maxResBtn.addEventListener('mouseout', () => {
  maxResBtn.innerText = '';
});

closeBtn.addEventListener('click', () => {
  //   window.open();
  //   window.open(location.href, '_self').close();
  window.close();
});

//switches between fullscreen to window mode based in isFullScreen status. This fails in case browser itself is in fullscreen mode as screen keeps switching between browser fullscreen size
maxResBtn.addEventListener('click', () => {
  const doc = document.documentElement;
  if (!isFullScreen) {
    doc.requestFullscreen();
    isFullScreen = 1;
  } else {
    document.exitFullscreen();
    isFullScreen = 0;
  }
});

//switches between minimized and maximized view
minimizeBtn.addEventListener('click', () => {
  const parentContainer = document.querySelector('.parent-container');
  if (!isMinimized) {
    parentContainer.classList.add('minimized');
    isMinimized = 1;
    document.querySelector('.idle').classList.add('hidden'); //to hide SELECT TAB warning after minimizing
  } else {
    parentContainer.classList.remove('minimized');
    isMinimized = 0;
    document.querySelector('.idle').classList.remove('hidden'); //to unhide SELECT TAB warning after maximizing
  }
});

//tab event handler to add new tab and close existing tab until totalTabCount is more than 1
tabs.addEventListener('click', (e) => {
  const el = e.target;
  if (
    !el.classList?.contains('create-new-tab') &&
    !el.classList?.contains('close-tab')
  )
    return;

  if (el.classList.contains('create-new-tab')) {
    const newTabDiv = document.createElement('div');
    // const newCloseTabBtn = document.createElement('span');
    const currTab = ++totalTab - 1;
    newTabDiv.classList.add('tab');
    newTabDiv.classList.add(`tab-${currTab}`);
    newTabDiv.setAttribute('id', `tab-${currTab}`);
    totalTabCount++;
    // newTabDiv.textContent = 'New Tab';
    // newCloseTabBtn.classList.add('close-tab');
    // newCloseTabBtn.textContent = '×';
    newTabDiv.innerHTML = 'New Tab' + '<span class="close-tab">×</span>';
    // console.log(newTab.closest('.create-new-tab-container').previousSibling);
    // newTab.closest('.create-new-tab-container')
    // newTabDiv.insertAdjacentElement('beforeend', newCloseTabBtn);
    tabContainer.insertAdjacentElement('beforeend', newTabDiv);
    const editorWindow = document.createElement('textarea');
    // editorWindow.classList.add(`textarea`);
    editorWindow.classList.add('textarea', `text-tab-${currTab}`, 'hidden');
    editorWindow.setAttribute('id', `textarea-tab-${currTab}`);
    document
      .querySelector('.parent-container')
      .insertAdjacentElement('beforeend', editorWindow);
  }
  if (el.classList.contains('close-tab')) {
    if (totalTabCount > 1) {
      el.parentElement.remove();
      totalTabCount--;
      document.querySelector(`#textarea-${el.parentElement.id}`).remove(); //remove corresponding textarea with tab
    } else {
      window.alert("Can't close the only open Tab. Close the browser Tab");
      open(location, '_self'); //reload to clear text area content and reset tab name;
    }
  }
});

const takeInputTabName = function () {
  let tabName = prompt(
    'Rename Tab (Name must be between 7 to 10 characters long)',
    'New Tab'
  );
  if (tabName.length < 7 || tabName.length > 10) {
    return takeInputTabName();
  }
  return tabName;
};

tabContainer.addEventListener('dblclick', (e) => {
  const tabname = takeInputTabName().slice(0, 10);
  e.target.innerHTML = tabname + '<span class="close-tab">×</span>';
});

tabContainer.addEventListener('click', (e) => {
  if (!e.target.classList?.contains('tab')) return;
  tabContainer.childNodes.forEach((x) => {
    if (x.classList?.contains('tab')) {
      //remove active class from each tab
      x.classList.remove('active');
    }
  });
  //add hidden to each textarea to make one textarea active by removing hidden class
  document.querySelectorAll('textarea').forEach((x) => {
    x.classList.add('hidden');
  });
  //add active class to clicked tab
  e.target.classList.add('active');
  //select textarea field which needs to be active
  const textArea = document.querySelector(`#textarea-${e.target.id}`);
  textArea.classList.remove('hidden'); //remove hidden from active text field
  //   console.log(textArea);
});

setTimeout(() => {
  //   document.querySelector('.notice').classList.add('hidden');
  document.querySelector('.notice').remove();
}, 1500);
