import Swal from "sweetalert2"

type InstructionsSteps = {
    title: string
    instructions: {
        title: string
        steps: string[]
    }[]
}

type InstructionsSimple = {
    title: string
    instructions: string
}

function generateInstructions (recipe: InstructionsSteps) {
    let html = '<ul>';

    // Add title
    html += `<li><b>${recipe.title}</b></li>`;

    // Iterate over instructions
    for (const instruction of recipe.instructions) {
        html += `<li><div><b>${instruction.title}</b></div>`;
        html += '<ol>';

        // Iterate over steps
        for (const step of instruction.steps) {
            html += `<li>${step}</li>`;
        }

        html += '</ol></li>';
    }

    html += '</ul>';

    return html;
}


export function renderInstructions(recipe: InstructionsSteps | InstructionsSimple) {
    if (typeof recipe.instructions === "string") return Swal.fire(recipe.title, recipe.instructions, "info")
    return Swal.fire({
        title: recipe.title,
        icon: "info",
        html: generateInstructions(recipe as InstructionsSteps)
    })
}
