// Get the unordered list element from the DOM
const unorderedListElement = document.getElementById("data");

// URL for fetching the JSON data
const url = "https://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts.json";

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    return response.json();
  } catch (error) {
    console.error("Error occurred:", error);
    displayErrorMessage("Failed to fetch data. Please try again later.");
    return null;
  }
}

// Function to display an error message
function displayErrorMessage(message) {
  const errorMessageElement = document.createElement("div");
  errorMessageElement.id = "error-message";
  errorMessageElement.textContent = message;
  errorMessageElement.style.color = "red";
  unorderedListElement.insertAdjacentElement("beforebegin", errorMessageElement);
}

// Helper function to create a list item for each post
function createListItem(post) {
  // Create the necessary DOM elements for each post
  const listItem = document.createElement("li");
  const card = document.createElement("div");
  const categoryHeading = document.createElement("h3");
  const hrTop = document.createElement("hr");
  const picture = document.createElement("img");
  const contentContainer = document.createElement("div");
  const titleLink = document.createElement("a");
  const footer = document.createElement("div");
  const authorDateParagraph = document.createElement("p");
  const blogType = document.createElement("p");

  // Format the date into a readable format (e.g., 18 June 2023)
  function formatDate(date) {
    const postDate = new Date(date);
    return postDate.toLocaleDateString("en-UK", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  // Assign appropriate classes to the elements for styling
  listItem.className = "purple-top-border p-card col-small-1 col-medium-2 col-3";
  card.className = "p-card__content";
  hrTop.className = "dotted-hr u-no-margin--top topHr";
  picture.className = "p-card__image";
  titleLink.className = "p-card__content";
  footer.className = "footer";
  blogType.className = "dotted-hr p-text--small";
  authorDateParagraph.className = "p-text--small";

  // Set the content of the elements
  categoryHeading.textContent = post._embedded["wp:term"][0][0].name.toUpperCase();
  titleLink.textContent = post.title.rendered;
  titleLink.href = post.link;
  authorDateParagraph.innerHTML = `<em>By <a href="${post._embedded.author[0].link}">${post._embedded.author[0].name}</a> on ${formatDate(post.date)}</em>`;
  picture.src = post.featured_media;
  blogType.textContent = "Article";

  // Append the elements to their respective parents
  listItem.appendChild(card);
  card.appendChild(categoryHeading);
  card.appendChild(hrTop);
  card.appendChild(picture);
  card.appendChild(contentContainer);
  contentContainer.appendChild(titleLink);
  contentContainer.appendChild(footer);
  footer.appendChild(authorDateParagraph);
  footer.appendChild(blogType);

  return listItem;
}

// Append the list items to the unordered list
function appendListItems(listItems) {
  const listFragmentContainer = document.createDocumentFragment();

  listItems.forEach((listItem) => {
    listFragmentContainer.appendChild(listItem);
  });

  unorderedListElement.appendChild(listFragmentContainer);
}

// Process the fetched data
async function processData() {
  const data = await fetchData(url);

  if (data) {
    const listItems = data.map((post) => createListItem(post));
    appendListItems(listItems);
  }
}

// Call the function to start the process
processData();
