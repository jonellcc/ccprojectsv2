let menuVisible = false;

document.addEventListener("DOMContentLoaded", () => {
		fetch('/jonellmagallanes')
				.then(response => response.json())
				.then(data => {
						const apiList = document.getElementById('api-list');
						const categories = {};
						const categoryIcons = {
								'News': `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z" /></svg>`,
								'Tools': `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`,
								'Entertainment': `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.176l-3.328 1.874a1 1 0 00-.472.846v3.256c0 .486.29.93.743 1.12l3.328 1.874c.48.27.994.41 1.517.41h.001c.49 0 .963-.15 1.34-.41l3.328-1.874c.453-.27.743-.724.743-1.12v-3.256a1 1 0 00-.472-.846l-3.328-1.874a2 2 0 00-1.04-1.176z" /></svg>`,
								'Social': `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.172-1.172m-1.172-3.328a4 4 0 00-5.656-5.656L3.95 10.95a4 4 0 105.656 5.656l-1.172-1.172" /></svg>`,
								'AI': `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M16 12h.01M10 12h.01M12 6h.01M12 2a10 10 0 100 20 10 10 0 000-20z" /></svg>`,
								'Default': `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13.5M12 18.753a3.75 3.75 0 01-3.75-3.75m3.75 3.75a3.75 3.75 0 003.75-3.75M5.602 11.25a3.75 3.75 0 010-7.5m3.75 7.5a3.75 3.75 0 010-7.5m3.75 7.5a3.75 3.75 0 010-7.5" /></svg>`,
						};

						data.forEach(api => {
								if (!categories[api.category]) {
										categories[api.category] = [];
								}
								categories[api.category].push(api);
						});

						const sortedCategories = Object.keys(categories).sort();

						sortedCategories.forEach((category, categoryIndex) => {
								const categoryDiv = document.createElement('div');
								categoryDiv.className = 'w-full mb-2'; // Each category container

								const categoryButton = document.createElement('button');
								categoryButton.className = "flex items-center justify-between w-full p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer animate-bounce-in";
								categoryButton.style.animationDelay = `${0.1 * categoryIndex}s`; // Stagger animation
								categoryButton.innerHTML = `
										<div class="flex items-center space-x-3">
												${categoryIcons[category] || categoryIcons['Default']}
												<h3 class="font-medium text-gray-800">${category}</h3>
										</div>
										<svg class="api-category-icon h-5 w-5 text-gray-600 transform transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
								`;

								const categoryContent = document.createElement('div');
								categoryContent.className = 'api-category-content space-y-4 pt-4'; // Content div for APIs

								categories[category].forEach((api, apiIndex) => {
										const fullUsage = `${api.usages}${api.query || ''}`;
										const apiItem = document.createElement('div');
										apiItem.className = 'p-4 rounded-lg bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in-up';
										// Delay for API item animation, relative to category expansion
										apiItem.style.animationDelay = `${0.1 * (apiIndex + 1)}s`; 
										apiItem.innerHTML = `
												<h4 class="font-semibold text-gray-900">${api.name}</h4>
												<p class="text-sm text-gray-600 my-1">${api.desc}</p>
												<p class="text-xs text-gray-500">Method: <span class="uppercase font-mono">${api.method}</span></p>
												<p class="text-xs text-gray-500">Usage: <a href="${fullUsage}" class="text-indigo-500 hover:underline break-words">${fullUsage}</a></p>
												<button onclick="tryApi('${fullUsage}')" class="mt-3 px-4 py-2 bg-indigo-500 text-white text-sm rounded-full hover:bg-indigo-600 transition duration-300 ease-in-out transform hover:scale-105 shadow-md">Try</button>
										`;
										categoryContent.appendChild(apiItem);
								});

								categoryButton.onclick = () => {
										const isActive = categoryContent.classList.toggle('active');
										categoryButton.classList.toggle('active'); // For the icon rotation

										// If active, reset and re-apply fade-in-up for child items
										if (isActive) {
												categoryContent.querySelectorAll('.animate-fade-in-up').forEach((item, index) => {
														item.classList.remove('animate-fade-in-up'); // Remove to allow re-trigger
														void item.offsetWidth; // Trigger reflow
														item.style.animationDelay = `${0.1 * (index + 1)}s`;
														item.classList.add('animate-fade-in-up');
												});
										}
								};

								categoryDiv.appendChild(categoryButton);
								categoryDiv.appendChild(categoryContent);
								apiList.appendChild(categoryDiv);
						});
				});

		fetch('/requests')
				.then(response => response.json())
				.then(data => {
						document.getElementById('request-count').textContent = `${data.request}`;
				});

		setInterval(updateTime, 1000);

		document.getElementById('user-agent').textContent = `${navigator.userAgent}`;

		fetch('https://api.ipify.org?format=json')
				.then(response => response.json())
				.then(data => {
						document.getElementById('ip').textContent = `${data.ip}`;
				});

});

function tryApi(fullUsage) {
		window.open(fullUsage, '_blank');
}

function updateTime() {
		const now = new Date();
		document.getElementById('current-time').textContent = `${now.toLocaleTimeString()}`;
}