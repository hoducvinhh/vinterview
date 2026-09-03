import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Vinterview database seed...');

  // 1. Seed Categories
  const categories = [
    {
      name: 'Frontend Development',
      slug: 'frontend-development',
      description: 'Questions covering client-side technologies, DOM, state management, and modern UI frameworks.',
    },
    {
      name: 'Backend Development',
      slug: 'backend-development',
      description: 'Questions focusing on server-side logic, API design, dependency injection, and microservices.',
    },
    {
      name: 'Database & Storage',
      slug: 'database-storage',
      description: 'Questions covering relational SQL, indexing, query optimization, caching, and NoSQL engines.',
    },
    {
      name: 'DevOps & Infrastructure',
      slug: 'devops-infrastructure',
      description: 'Questions covering containerization, deployment pipelines, CI/CD, and cloud infrastructure.',
    },
    {
      name: 'Web Architecture & Performance',
      slug: 'web-architecture-performance',
      description: 'Questions covering rendering strategies (SSR, SSG, ISR), network protocols, security, and web performance.',
    },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
    categoryMap.set(cat.slug, created.id);
  }
  console.log(`✅ Seeded ${categories.length} Categories.`);

  // 2. Seed Technologies
  const technologies = [
    { name: 'JavaScript', slug: 'javascript', icon: 'javascript' },
    { name: 'TypeScript', slug: 'typescript', icon: 'typescript' },
    { name: 'Node.js', slug: 'nodejs', icon: 'nodejs' },
    { name: 'NestJS', slug: 'nestjs', icon: 'nestjs' },
    { name: 'React', slug: 'react', icon: 'react' },
    { name: 'Next.js', slug: 'nextjs', icon: 'nextjs' },
    { name: 'PostgreSQL', slug: 'postgresql', icon: 'postgresql' },
    { name: 'Redis', slug: 'redis', icon: 'redis' },
    { name: 'Docker', slug: 'docker', icon: 'docker' },
  ];

  const techMap = new Map<string, string>();
  for (const tech of technologies) {
    const created = await prisma.technology.upsert({
      where: { slug: tech.slug },
      update: { name: tech.name, icon: tech.icon },
      create: tech,
    });
    techMap.set(tech.slug, created.id);
  }
  console.log(`✅ Seeded ${technologies.length} Technologies.`);

  // 3. Seed 20 Realistic Interview Questions with Answers
  const questionsData = [
    // --- JAVASCRIPT ---
    {
      title: 'What is the Event Loop in JavaScript and how does it handle asynchronous operations?',
      slug: 'javascript-event-loop-asynchronous-operations',
      difficulty: Difficulty.MEDIUM,
      categorySlug: 'frontend-development',
      techSlug: 'javascript',
      content: `Explain the mechanics of the JavaScript Event Loop, Call Stack, Task Queue (Macrotasks), and Microtask Queue. How does V8 process Promises versus \`setTimeout\` callbacks?`,
      answer: {
        content: `JavaScript is single-threaded and uses an event-driven loop to process non-blocking I/O operations. The Event Loop continuously checks if the Call Stack is empty. If it is, it first empties all callbacks in the Microtask Queue (Promises, \`queueMicrotask\`, \`process.nextTick\` in Node) before executing the next callback from the Macrotask Queue (\`setTimeout\`, \`setInterval\`, I/O).`,
        codeSnippet: `console.log('1');

setTimeout(() => console.log('2'), 0); // Macrotask

Promise.resolve().then(() => console.log('3')); // Microtask

console.log('4');

// Output order: 1 -> 4 -> 3 -> 2`,
        explanation: `Even though \`setTimeout\` has a delay of 0ms, its callback is scheduled in the Macrotask queue. Promises register callbacks in the Microtask queue, which has higher priority and executes immediately after the current synchronous execution context finishes.`,
      },
    },
    {
      title: 'Explain the differences between var, let, and const in terms of scoping and hoisting.',
      slug: 'javascript-var-let-const-scoping-hoisting',
      difficulty: Difficulty.EASY,
      categorySlug: 'frontend-development',
      techSlug: 'javascript',
      content: `Compare \`var\`, \`let\`, and \`const\` in JavaScript. Detail function scope versus block scope, redeclaration rules, and the Temporal Dead Zone (TDZ).`,
      answer: {
        content: `\`var\` is function-scoped and hoisted with an initial value of \`undefined\`. \`let\` and \`const\` are block-scoped ({ ... }) and hoisted without initialization, placing them in the Temporal Dead Zone (TDZ) until the execution reaches their declaration line. \`const\` additionally prevents re-assignment of the variable binding.`,
        codeSnippet: `console.log(a); // undefined (var is hoisted)
var a = 10;

// console.log(b); // ReferenceError: Cannot access 'b' before initialization (TDZ)
let b = 20;

const c = { name: 'Vinterview' };
c.name = 'Updated'; // Allowed (mutation of property)
// c = {}; // TypeError: Assignment to constant variable`,
        explanation: `Variables declared with \`let\` and \`const\` exist in the TDZ from the beginning of their enclosing block until the declaration is evaluated. Accessing them inside TDZ throws a ReferenceError instead of returning \`undefined\`.`,
      },
    },
    {
      title: 'How do Closures work in JavaScript and what are their primary use cases?',
      slug: 'javascript-closures-lexical-scope',
      difficulty: Difficulty.MEDIUM,
      categorySlug: 'frontend-development',
      techSlug: 'javascript',
      content: `Define a closure in JavaScript. Provide examples of lexical environment binding, data encapsulation (private state), and function currying.`,
      answer: {
        content: `A closure is the combination of a function bundled together with references to its surrounding state (lexical environment). In JavaScript, closures give inner functions access to an outer function's scope even after the outer function has returned.`,
        codeSnippet: `function createCounter() {
  let count = 0; // Private variable
  return {
    increment: () => ++count,
    getCount: () => count,
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2
// count is inaccessible directly from outside`,
        explanation: `Closures allow for private data encapsulation, memoization, event handler state preservation, and factory function implementations without polluting the global scope.`,
      },
    },

    // --- TYPESCRIPT ---
    {
      title: 'What is the difference between type aliases and interfaces in TypeScript?',
      slug: 'typescript-type-aliases-vs-interfaces',
      difficulty: Difficulty.EASY,
      categorySlug: 'frontend-development',
      techSlug: 'typescript',
      content: `Contrast \`type\` aliases and \`interface\` definitions in TypeScript. When should you prefer one over the other?`,
      answer: {
        content: `Both \`interface\` and \`type\` describe object shapes, but \`interface\` supports declaration merging (adding properties to an existing interface across modules) and object inheritance via \`extends\`. \`type\` aliases can represent primitives, union types (\`string | number\`), tuple types, and mapped types.`,
        codeSnippet: `// Interface declaration merging
interface User {
  id: string;
}
interface User {
  name: string; // Merged with above
}

// Type union & primitive mapping
type Status = 'pending' | 'active' | 'completed';
type UserOrId = User | string;`,
        explanation: `As a best practice: Use \`interface\` for public API surface definitions and object schemas (due to extension and merging capabilities), and use \`type\` for unions, primitives, tuples, or complex mapped types.`,
      },
    },
    {
      title: 'How do Generics work in TypeScript and how do you apply generic constraints?',
      slug: 'typescript-generics-and-type-constraints',
      difficulty: Difficulty.MEDIUM,
      categorySlug: 'frontend-development',
      techSlug: 'typescript',
      content: `Explain TypeScript generics. How do you create reusable, type-safe functions and classes, and enforce constraints using the \`extends\` keyword?`,
      answer: {
        content: `Generics allow components to work over a variety of types rather than a single one, providing type safety without losing type information. Generic constraints (\`T extends KnownShape\`) restrict the types that can be passed into a generic parameter.`,
        codeSnippet: `interface Lengthwise {
  length: number;
}

// Enforce that T must have a .length property
function logLength<T extends Lengthwise>(arg: T): number {
  console.log(arg.length);
  return arg.length;
}

logLength('Hello World'); // Works (string has length)
logLength([1, 2, 3]);    // Works (array has length)
// logLength(123);       // Error: number does not have .length`,
        explanation: `Generic constraints prevent runtime errors by ensuring that generic arguments satisfy specified interface shape boundaries before compilation.`,
      },
    },

    // --- REACT ---
    {
      title: 'What is the Virtual DOM and how does React Reconciliation work?',
      slug: 'react-virtual-dom-reconciliation-fiber',
      difficulty: Difficulty.HARD,
      categorySlug: 'frontend-development',
      techSlug: 'react',
      content: `Describe how React maintains a lightweight representation of the real DOM in memory. Explain the Fiber architecture, diffing heuristics, and batch updates.`,
      answer: {
        content: `The Virtual DOM (VDOM) is a lightweight in-memory representation of the actual DOM nodes. When component state changes, React creates a new VDOM tree and compares it with the previous VDOM tree using its heuristic Diffing Algorithm (O(n) complexity). It then batches minimal mutations and applies them to the real DOM during the Commit phase.`,
        codeSnippet: `// Heuristic rules:
// 1. Elements of different types produce different trees (tears down old tree)
// 2. Keys allow React to match children across renders deterministically:
<ul>
  {items.map((item) => (
    <li key={item.id}>{item.name}</li>
  ))}
</ul>`,
        explanation: `React Fiber allows breaking down rendering work into incremental chunks (units of work) that can be paused, aborted, or prioritized based on browser animation frames and user interaction priority.`,
      },
    },
    {
      title: 'Explain the Rules of Hooks in React and why hooks cannot be called inside loops or conditionals.',
      slug: 'react-rules-of-hooks-execution-order',
      difficulty: Difficulty.EASY,
      categorySlug: 'frontend-development',
      techSlug: 'react',
      content: `Why must React Hooks be called at the top level of component functions? How does React internally track hook state across re-renders?`,
      answer: {
        content: `React relies on the exact execution order of Hook calls on every render. Internally, React stores hooks as a linked list attached to the component's Fiber node. Calling a hook conditionally alters the index order in this linked list, causing state mismatches and memory corruption.`,
        codeSnippet: `// ❌ BAD: Conditional hook call
function Component({ isLoaded }) {
  if (isLoaded) {
    useEffect(() => {}, []); // Order changes based on prop!
  }
}

// ✅ GOOD: Hook at top level
function Component({ isLoaded }) {
  useEffect(() => {
    if (!isLoaded) return;
    // Effect logic here
  }, [isLoaded]);
}`,
        explanation: `Because hook state is retrieved sequentially based on call order rather than variable names, calling hooks inside conditional statements or loops breaks React's index lookup during subsequent renders.`,
      },
    },
    {
      title: 'How do useMemo and useCallback work in React, and when should you avoid using them?',
      slug: 'react-usememo-usecallback-performance-optimization',
      difficulty: Difficulty.MEDIUM,
      categorySlug: 'frontend-development',
      techSlug: 'react',
      content: `Differentiate between \`useMemo\` and \`useCallback\`. What performance trade-offs exist, and why is over-using them detrimental?`,
      answer: {
        content: `\`useMemo\` caches the *result* of an expensive calculation, while \`useCallback\` caches the *function instance* between renders. Overusing them adds overhead because React still has to instantiate the dependency array and perform memory comparisons on every single render.`,
        codeSnippet: `// Caches calculated value
const expensiveValue = useMemo(() => computeHeavyTask(data), [data]);

// Caches function reference to prevent child re-renders (when wrapped in React.memo)
const handleClick = useCallback(() => {
  doAction(id);
}, [id]);`,
        explanation: `Only use \`useMemo\` for computationally heavy operations (e.g. filtering large arrays) and \`useCallback\` when passing functions to child components optimized with \`React.memo\`. Avoid premature optimization on lightweight operations.`,
      },
    },

    // --- NEXT.JS ---
    {
      title: 'What is the difference between Server Components and Client Components in Next.js App Router?',
      slug: 'nextjs-server-components-vs-client-components',
      difficulty: Difficulty.MEDIUM,
      categorySlug: 'web-architecture-performance',
      techSlug: 'nextjs',
      content: `Compare React Server Components (RSC) and Client Components ('use client') in Next.js. What are the bundle size, security, and data fetching implications?`,
      answer: {
        content: `Server Components render exclusively on the server, sending zero JavaScript bytes to the client bundle. They can directly access backend resources (DB, secrets). Client Components (\`'use client'\`) are pre-rendered on the server and hydrated on the client, supporting state, effects, and browser event listeners.`,
        codeSnippet: `// Server Component (default in App Router)
// Direct DB access, zero client JS bundle size
import { db } from '@/lib/db';

export default async function UserProfile({ id }) {
  const user = await db.user.findUnique({ where: { id } });
  return <div>{user.name}</div>;
}

// Client Component ('use client')
'use client';
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`,
        explanation: `Keep components as Server Components by default to reduce client JavaScript bundle size and improve Core Web Vitals. Push \`'use client'\` boundaries down to the lowest interactive leaf components.`,
      },
    },

    // --- NODE.JS ---
    {
      title: 'How does Node.js handle concurrency despite being single-threaded?',
      slug: 'nodejs-concurrency-libuv-worker-threads',
      difficulty: Difficulty.MEDIUM,
      categorySlug: 'backend-development',
      techSlug: 'nodejs',
      content: `Explain Node.js asynchronous architecture. Describe Libuv's thread pool, non-blocking I/O polling, and worker threads for CPU-bound tasks.`,
      answer: {
        content: `Node.js executes JavaScript code in a single thread, but delegates asynchronous I/O tasks (file system, network calls, crypto) to the operating system kernel or to Libuv's background thread pool (default 4 threads). When the asynchronous operation completes, Libuv queues the callback into the event loop.`,
        codeSnippet: `const fs = require('fs');

console.log('1. Start');

// Delegated to Libuv thread pool (non-blocking)
fs.readFile('large-file.txt', 'utf8', (err, data) => {
  console.log('3. File read complete');
});

console.log('2. End');

// Output order: 1. Start -> 2. End -> 3. File read complete`,
        explanation: `Node.js handles thousands of concurrent HTTP requests efficiently because I/O calls do not block the main thread. For CPU-bound tasks (like video encoding or image processing), developers should use Worker Threads or external background queues.`,
      },
    },
    {
      title: 'What is the difference between process.nextTick() and setImmediate() in Node.js?',
      slug: 'nodejs-process-nexttick-vs-setimmediate',
      difficulty: Difficulty.HARD,
      categorySlug: 'backend-development',
      techSlug: 'nodejs',
      content: `Compare \`process.nextTick()\` and \`setImmediate()\` in Node.js event loop phases. What risks are associated with recursive \`nextTick\` calls?`,
      answer: {
        content: `\`process.nextTick()\` fires immediately after the current operation completes, before the event loop continues to any phase. \`setImmediate()\` queues callbacks to execute in the Check phase of the event loop (after I/O events).`,
        codeSnippet: `setImmediate(() => console.log('setImmediate'));

process.nextTick(() => console.log('nextTick'));

console.log('main context');

// Output:
// main context
// nextTick
// setImmediate`,
        explanation: `Calling \`process.nextTick()\` recursively will starve the Event Loop, completely preventing I/O operations and timers from executing!`,
      },
    },

    // --- NESTJS ---
    {
      title: 'Explain Dependency Injection (DI) in NestJS and how @Injectable() works under the hood.',
      slug: 'nestjs-dependency-injection-provider-lifecycle',
      difficulty: Difficulty.MEDIUM,
      categorySlug: 'backend-development',
      techSlug: 'nestjs',
      content: `Describe NestJS's Inversion of Control (IoC) container. How does TypeScript metadata (\`reflect-metadata\`) assist NestJS in resolving dependencies?`,
      answer: {
        content: `NestJS uses the Inversion of Control (IoC) pattern to manage dependencies automatically. When a class is annotated with \`@Injectable()\`, NestJS registers it as a Provider in the module context. During initialization, NestJS reads TypeScript constructor parameter types via \`reflect-metadata\` and injects singletons automatically.`,
        codeSnippet: `@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.question.findMany();
  }
}

@Controller('questions')
export class QuestionsController {
  // NestJS IoC injects QuestionsService automatically
  constructor(private readonly questionsService: QuestionsService) {}
}`,
        explanation: `Dependency Injection decouples class implementations, simplifies unit testing (by enabling mock provider replacement), and manages singleton instance lifecycles cleanly.`,
      },
    },
    {
      title: 'What is the difference between Guards, Interceptors, Pipes, and Middleware in NestJS?',
      slug: 'nestjs-guards-interceptors-pipes-middleware-execution-order',
      difficulty: Difficulty.HARD,
      categorySlug: 'backend-development',
      techSlug: 'nestjs',
      content: `Detail the exact NestJS request-response lifecycle execution order for Middleware, Guards, Interceptors, Pipes, and Exception Filters.`,
      answer: {
        content: `The request processing order in NestJS is:
1. **Middleware**: Express/Fastify raw request handling (logging, body parsing).
2. **Guards**: Authentication & Authorization checks (\`CanActivate\`).
3. **Interceptors (Pre-controller)**: Request transformation or binding data.
4. **Pipes**: Data validation and payload transformation (e.g. \`ValidationPipe\`).
5. **Controller Handler**: Business logic execution.
6. **Interceptors (Post-controller)**: Response transformation or caching.
7. **Exception Filters**: Catching and formatting unhandled errors into standard HTTP responses.`,
        codeSnippet: `// Guard Example
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.user?.role === 'ADMIN';
  }
}`,
        explanation: `Understanding the lifecycle sequence prevents bugs like attempting to read validated DTO parameters inside Middleware before Pipes have transformed them.`,
      },
    },

    // --- POSTGRESQL ---
    {
      title: 'What is the difference between INNER JOIN, LEFT JOIN, and FULL OUTER JOIN in PostgreSQL?',
      slug: 'postgresql-inner-left-right-full-outer-joins',
      difficulty: Difficulty.EASY,
      categorySlug: 'database-storage',
      techSlug: 'postgresql',
      content: `Explain SQL JOIN types. Provide examples showing result set differences when querying related relational tables in PostgreSQL.`,
      answer: {
        content: `\`INNER JOIN\` returns only rows with matching keys in both tables. \`LEFT JOIN\` returns all rows from the left table and matching rows from the right table (filling \`NULL\` for non-matches). \`FULL OUTER JOIN\` returns all rows from both tables, filling \`NULL\` wherever a match does not exist.`,
        codeSnippet: `-- INNER JOIN: Only questions that have an author
SELECT q.title, u.email 
FROM "Question" q 
INNER JOIN "User" u ON q."authorId" = u.id;

-- LEFT JOIN: All questions, even those without an author (authorId IS NULL)
SELECT q.title, u.email 
FROM "Question" q 
LEFT JOIN "User" u ON q."authorId" = u.id;`,
        explanation: `Use \`LEFT JOIN\` when target relation records are optional (e.g. optional Question author), and \`INNER JOIN\` when relation records are mandatory.`,
      },
    },
    {
      title: 'How do Database Indexes (B-Tree) improve query performance in PostgreSQL?',
      slug: 'postgresql-b-tree-indexes-query-performance',
      difficulty: Difficulty.MEDIUM,
      categorySlug: 'database-storage',
      techSlug: 'postgresql',
      content: `Explain B-Tree indexes in PostgreSQL. How do they convert O(N) sequential scans into O(log N) index scans, and what are write trade-offs?`,
      answer: {
        content: `A B-Tree index maintains a self-balancing tree structure of indexed key values pointing to physical heap tuples. Searching an indexed column allows PostgreSQL to find target rows in O(log N) time instead of performing an O(N) sequential table scan. However, every index increases write overhead during \`INSERT\`, \`UPDATE\`, and \`DELETE\` operations.`,
        codeSnippet: `-- Create composite index for filtering by difficulty and category
CREATE INDEX "idx_question_diff_cat" 
ON "Question" ("categoryId", "difficulty");

-- PostgreSQL query optimizer uses this index for:
SELECT * FROM "Question" 
WHERE "categoryId" = '123' AND "difficulty" = 'HARD';`,
        explanation: `Always index foreign key columns and fields heavily used in \`WHERE\`, \`ORDER BY\`, and \`JOIN\` conditions, but avoid over-indexing tables with high write volume.`,
      },
    },

    // --- REDIS ---
    {
      title: 'What are the primary use cases for Redis in modern web application architecture?',
      slug: 'redis-use-cases-caching-session-rate-limiting',
      difficulty: Difficulty.EASY,
      categorySlug: 'database-storage',
      techSlug: 'redis',
      content: `Why is Redis used alongside relational databases like PostgreSQL? Detail use cases including caching, session storage, pub/sub, and rate limiting.`,
      answer: {
        content: `Redis is an in-memory key-value data structure store providing sub-millisecond response times. Primary use cases include: 1) Caching expensive database queries, 2) Managing user sessions, 3) Implementing Rate Limiters (sliding window), and 4) Message Queuing via Pub/Sub or Streams.`,
        codeSnippet: `// Node.js + Redis Caching Example
async function getQuestionBySlug(slug) {
  const cached = await redis.get(\`question:\${slug}\`);
  if (cached) return JSON.parse(cached);

  const question = await prisma.question.findUnique({ where: { slug } });
  await redis.set(\`question:\${slug}\`, JSON.stringify(question), 'EX', 3600); // 1 hr TTL
  return question;
}`,
        explanation: `In-memory caching offloads repetitive read operations from PostgreSQL, drastically reducing database CPU load and improving response latency.`,
      },
    },
    {
      title: 'How do you implement a Distributed Lock or Rate Limiter using Redis in Node.js?',
      slug: 'redis-distributed-lock-rate-limiter-implementation',
      difficulty: Difficulty.HARD,
      categorySlug: 'database-storage',
      techSlug: 'redis',
      content: `Explain the Redlock algorithm for distributed locks and the Sliding Window pattern for API rate limiting using Redis atomic operations (\`INCR\`, \`EXPIRE\`, Lua scripts).`,
      answer: {
        content: `To implement an atomic rate limiter or distributed lock across multiple backend instances, Redis uses atomic commands or Lua scripts. A distributed lock uses \`SET key value NX PX milliseconds\` to set a key only if it does not exist, ensuring concurrency control across microservices.`,
        codeSnippet: `// Atomic lock acquisition in Redis
const acquired = await redis.set(
  'lock:question:update:123',
  instanceId,
  'NX', // Only set if Not eXists
  'PX', 10000 // Expire in 10,000 ms (auto-release safety)
);

if (acquired === 'OK') {
  // Execute critical section
}`,
        explanation: `Atomic commands and Lua scripts execute in a single step inside Redis's single-threaded event loop, preventing race conditions between distributed microservices.`,
      },
    },

    // --- DOCKER ---
    {
      title: 'What is the difference between a Docker Image and Container, and how does Multi-Stage Building work?',
      slug: 'docker-images-containers-multi-stage-builds',
      difficulty: Difficulty.EASY,
      categorySlug: 'devops-infrastructure',
      techSlug: 'docker',
      content: `Compare Docker Images and Containers. Explain how Multi-Stage \`Dockerfile\` builds optimize production image size by stripping dev dependencies.`,
      answer: {
        content: `A Docker Image is a read-only blueprint containing application code, dependencies, and environment configurations. A Docker Container is a runnable instance of an image. Multi-stage builds allow using multiple \`FROM\` instructions in a single \`Dockerfile\` to compile assets in a builder stage and copy only production artifacts into a slim final image.`,
        codeSnippet: `# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production runner stage (minimal size)
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]`,
        explanation: `Multi-stage builds reduce production image sizes from 1GB+ down to ~100MB by discarding TypeScript source files, build compilers, and devDependencies.`,
      },
    },
    {
      title: 'What are ACID properties in relational databases and how does PostgreSQL handle isolation levels?',
      slug: 'postgresql-acid-properties-transaction-isolation-levels',
      difficulty: Difficulty.HARD,
      categorySlug: 'database-storage',
      techSlug: 'postgresql',
      content: `Explain Atomicity, Consistency, Isolation, and Durability (ACID). Detail read phenomena (Dirty Read, Non-Repeatable Read, Phantom Read) and PostgreSQL isolation levels.`,
      answer: {
        content: `ACID guarantees reliable database transactions. Atomicity ensures all-or-nothing execution. Consistency ensures data validity constraints are maintained. Isolation isolates concurrent transactions using Multi-Version Concurrency Control (MVCC). Durability guarantees committed changes persist on disk.`,
        codeSnippet: `-- Setting transaction isolation level in PostgreSQL
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;

UPDATE "Account" SET balance = balance - 100 WHERE id = 'user-1';
UPDATE "Account" SET balance = balance + 100 WHERE id = 'user-2';

COMMIT;`,
        explanation: `PostgreSQL default isolation level is Read Committed. Upgrading to Repeatable Read or Serializable prevents phantom reads and race conditions at the cost of potential serialization failures that require client-side transaction retries.`,
      },
    },
    {
      title: 'How does Docker Networking work, and what is the difference between bridge, host, and overlay networks?',
      slug: 'docker-networking-bridge-host-overlay',
      difficulty: Difficulty.MEDIUM,
      categorySlug: 'devops-infrastructure',
      techSlug: 'docker',
      content: `Compare Docker network drivers: Bridge, Host, and Overlay. When should you use each network mode in standalone containers versus Docker Swarm clusters?`,
      answer: {
        content: `Bridge is the default network driver for single-host containers, isolating container IPs behind a NAT bridge. Host network mode shares the host's networking stack directly (no port mapping overhead). Overlay network mode enables multi-host container communication across Docker Swarm nodes.`,
        codeSnippet: `# Create a custom isolated bridge network
docker network create vinterview-net

# Run container attached to custom network
docker run -d --name api-service --network vinterview-net api-image`,
        explanation: `Using custom user-defined bridge networks provides automatic DNS resolution between container names (e.g. \`api-service\` resolves directly without IP hardcoding).`,
      },
    },
  ];

  let questionCount = 0;
  for (const q of questionsData) {
    const categoryId = categoryMap.get(q.categorySlug);
    const technologyId = techMap.get(q.techSlug);

    if (!categoryId || !technologyId) {
      console.warn(`⚠️ Warning: Missing relation for ${q.slug}`);
      continue;
    }

    // Upsert Question (Idempotent by slug)
    const question = await prisma.question.upsert({
      where: { slug: q.slug },
      update: {
        title: q.title,
        content: q.content,
        difficulty: q.difficulty,
        categoryId: categoryId,
        technologyId: technologyId,
      },
      create: {
        title: q.title,
        slug: q.slug,
        content: q.content,
        difficulty: q.difficulty,
        categoryId: categoryId,
        technologyId: technologyId,
      },
    });

    // Upsert Answer for this Question (Idempotent by questionId)
    await prisma.answer.upsert({
      where: { questionId: question.id },
      update: {
        content: q.answer.content,
        codeSnippet: q.answer.codeSnippet,
        explanation: q.answer.explanation,
      },
      create: {
        questionId: question.id,
        content: q.answer.content,
        codeSnippet: q.answer.codeSnippet,
        explanation: q.answer.explanation,
      },
    });

    questionCount++;
  }

  console.log(`✅ Seeded ${questionCount} Interview Questions & Answers.`);
  console.log('🚀 Vinterview database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed process failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
