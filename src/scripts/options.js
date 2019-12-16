browser.storage.local.get('accessToken').then(val => {
    if (val.accessToken) {
        document.getElementById('personal-access-token').value = val.accessToken;
    }
});

document.getElementById('form').addEventListener('submit', e => {
    browser.storage.local.set({ accessToken: document.getElementById('personal-access-token').value });
});
