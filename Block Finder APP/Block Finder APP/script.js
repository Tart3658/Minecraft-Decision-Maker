const rollButton = document.querySelector('.roll-button');
const blockNameDisplay = document.querySelector('.image-section h3');
const blockImage = document.querySelector('.block-image');
const craftingText = document.querySelector('.crafting-text');

async function rollForBlock() {
  try {
    const [blocksResponse, recipesResponse] = await Promise.all([
      fetch('blocks.JSON'),
      fetch('recipes.JSON')
    ]);

    if (!blocksResponse.ok || !recipesResponse.ok) {
      throw new Error('Failed to load JSON data');
    }

    const blocks = await blocksResponse.json();
    const recipes = await recipesResponse.json();

    const validBlocks = Array.isArray(blocks)
      ? blocks.filter(block => block && block.name && block.image)
      : [];

    if (validBlocks.length === 0) {
      throw new Error('No valid blocks found');
    }

    const randomBlock = validBlocks[Math.floor(Math.random() * validBlocks.length)];

    const target = (randomBlock.item || randomBlock.name || '').toLowerCase();

    const matchingRecipes = Array.isArray(recipes)
      ? recipes.filter(recipe => {
          if (!recipe || !Array.isArray(recipe.recipe)) return false;
          const ingredients = recipe.recipe
            .filter(Boolean)
            .map(ing => String(ing).toLowerCase());
          return ingredients.some(ing => ing.includes(target));
        })
      : [];

    const selectedRecipe = matchingRecipes.length > 0
      ? matchingRecipes[Math.floor(Math.random() * matchingRecipes.length)]
      : null;

    const recipeItem = selectedRecipe?.item || '';

    blockNameDisplay.textContent = recipeItem
      ? `${randomBlock.name} - Craft: ${recipeItem}`
      : randomBlock.name;

    blockImage.src = randomBlock.image;
    blockImage.alt = randomBlock.name;

    craftingText.textContent = recipeItem
      ? `FIND THE "${randomBlock.name.toUpperCase()}" BLOCK AND CRAFT A ${recipeItem.toUpperCase()} WITH IT IN MINECRAFT`
      : `FIND THE "${randomBlock.name.toUpperCase()}" BLOCK IN MINECRAFT AND BUILD A HOUSE WITH IT`;

  } catch (error) {
    console.error('Error:', error);
    blockNameDisplay.textContent = 'Error loading block and recipe';
    blockImage.src = '';
    blockImage.alt = 'error';
    craftingText.textContent = 'Please refresh and try again.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (rollButton) {
    rollButton.addEventListener('click', rollForBlock);
  }
});
