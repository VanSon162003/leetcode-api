export class Problem {
    constructor({
        id,
        title,
        description,
        difficulty,
        categoryId,
        testCases,
        timeLimit,
        memoryLimit,
        starterCode,
    }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.categoryId = categoryId;
        this.testCases = testCases;
        this.timeLimit = timeLimit || 2; // default 2 seconds
        this.memoryLimit = memoryLimit || 128; // default 128MB
        this.starterCode = starterCode || {};
    }
}
