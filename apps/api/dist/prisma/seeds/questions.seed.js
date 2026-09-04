"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionsData = void 0;
exports.seedQuestions = seedQuestions;
const client_1 = require("@prisma/client");
exports.questionsData = [
    {
        title: 'Event Loop trong JavaScript là gì và nó xử lý các thao tác bất đồng bộ (asynchronous) như thế nào?',
        slug: 'javascript-event-loop-asynchronous-operations',
        difficulty: client_1.Difficulty.MEDIUM,
        categorySlug: 'frontend-development',
        techSlug: 'javascript',
        content: `Hãy giải thích cơ chế hoạt động của Event Loop, Call Stack, Task Queue (Macrotasks) và Microtask Queue trong JavaScript. Engine V8 xử lý callback của Promises khác gì so với \`setTimeout\`?`,
        answer: {
            content: `JavaScript là ngôn ngữ đơn luồng (single-threaded) và sử dụng Event Loop theo cơ chế event-driven để xử lý các thao tác I/O không chặn (non-blocking). Event Loop liên tục kiểm tra xem Call Stack có rỗng hay không. Nếu Call Stack rỗng, nó sẽ ưu tiên thực thi toàn bộ callback trong Microtask Queue (Promises, \`queueMicrotask\`, \`process.nextTick\` trong Node.js) trước khi lấy callback tiếp theo từ Macrotask Queue (\`setTimeout\`, \`setInterval\`, I/O).`,
            codeSnippet: `console.log('1');

setTimeout(() => console.log('2'), 0); // Macrotask

Promise.resolve().then(() => console.log('3')); // Microtask

console.log('4');

// Thứ tự Output: 1 -> 4 -> 3 -> 2`,
            explanation: `Mặc dù \`setTimeout\` có thời gian chờ là 0ms, callback của nó vẫn được xếp vào Macrotask queue. Trong khi đó, Promise đăng ký callback vào Microtask queue - nơi có độ ưu tiên cao hơn và sẽ được thực thi ngay sau khi execution context đồng bộ hiện tại kết thúc.`,
        },
    },
    {
        title: 'Phân biệt sự khác nhau giữa var, let và const về phạm vi truy cập (scoping) và cơ chế hoisting?',
        slug: 'javascript-var-let-const-scoping-hoisting',
        difficulty: client_1.Difficulty.EASY,
        categorySlug: 'frontend-development',
        techSlug: 'javascript',
        content: `So sánh \`var\`, \`let\` và \`const\` trong JavaScript. Trình bày chi tiết về function scope so với block scope, quy tắc khai báo lại (redeclaration) và vùng chết thời gian (Temporal Dead Zone - TDZ).`,
        answer: {
            content: `\`var\` có phạm vi function-scope và được hoisting với giá trị khởi tạo ban đầu là \`undefined\`. \`let\` và \`const\` có phạm vi block-scope ({ ... }) và được hoisting nhưng không được khởi tạo giá trị, khiến chúng nằm trong Temporal Dead Zone (TDZ) cho đến khi luồng thực thi chạy tới dòng khai báo. Ngoài ra, \`const\` ngăn chặn việc gán lại (re-assignment) biến.`,
            codeSnippet: `console.log(a); // undefined (var được hoisting)
var a = 10;

// console.log(b); // ReferenceError: Cannot access 'b' before initialization (TDZ)
let b = 20;

const c = { name: 'Vinterview' };
c.name = 'Updated'; // Hợp lệ (thay đổi thuộc tính của object)
// c = {}; // TypeError: Assignment to constant variable`,
            explanation: `Các biến khai báo bằng \`let\` và \`const\` sẽ nằm trong vùng TDZ từ đầu block chứa chúng cho tới khi dòng lệnh khai báo được thực thi. Việc truy cập biến khi đang ở trong TDZ sẽ bắn ra lỗi ReferenceError chứ không trả về \`undefined\`.`,
        },
    },
    {
        title: 'Closure trong JavaScript hoạt động như thế nào và các trường hợp sử dụng (use cases) phổ biến là gì?',
        slug: 'javascript-closures-lexical-scope',
        difficulty: client_1.Difficulty.MEDIUM,
        categorySlug: 'frontend-development',
        techSlug: 'javascript',
        content: `Định nghĩa về Closure trong JavaScript. Cho ví dụ về việc đóng gói dữ liệu (data encapsulation / private state), liên kết lexical environment và kỹ thuật function currying.`,
        answer: {
            content: `Closure là sự kết hợp giữa một hàm và môi trường ngữ cảnh (lexical environment) nơi hàm đó được khai báo. Trong JavaScript, Closure cho phép một hàm bên trong truy cập vào phạm vi của hàm bên ngoài ngay cả khi hàm bên ngoài đó đã thực thi xong và trả về kết quả.`,
            codeSnippet: `function createCounter() {
  let count = 0; // Biến private
  return {
    increment: () => ++count,
    getCount: () => count,
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2
// count không thể truy cập trực tiếp từ bên ngoài`,
            explanation: `Closure giúp đóng gói dữ liệu riêng tư (private data encapsulation), hỗ trợ memoization, lưu trữ trạng thái của event handler và triển khai các pattern như Factory Function mà không làm ô nhiễm scope toàn cục.`,
        },
    },
    {
        title: 'Phân biệt sự khác nhau giữa Type Alias và Interface trong TypeScript?',
        slug: 'typescript-type-aliases-vs-interfaces',
        difficulty: client_1.Difficulty.EASY,
        categorySlug: 'frontend-development',
        techSlug: 'typescript',
        content: `So sánh định nghĩa \`type\` alias và \`interface\` trong TypeScript. Khi nào nên ưu tiên dùng \`interface\` thay vì \`type\` và ngược lại?`,
        answer: {
            content: `Cả \`interface\` và \`type\` đều dùng để mô tả cấu trúc của Object. Tuy nhiên, \`interface\` hỗ trợ cơ chế declaration merging (gộp thuộc tính vào interface đã tồn tại) và thừa kế thông qua \`extends\`. Trong khi đó, \`type\` alias có thể đại diện cho các kiểu dữ liệu nguyên thủy (primitives), Union types (\`string | number\`), Tuple types và Mapped types.`,
            codeSnippet: `// Interface declaration merging (gộp thuộc tính)
interface User {
  id: string;
}
interface User {
  name: string; // Tự động gộp với interface trên
}

// Type union & primitive mapping
type Status = 'pending' | 'active' | 'completed';
type UserOrId = User | string;`,
            explanation: `Theo best practice: Sử dụng \`interface\` cho việc định nghĩa API public và cấu trúc Object (nhờ khả năng mở rộng và gộp declaration), và sử dụng \`type\` cho các trường hợp Union, Primitives, Tuples hoặc Mapped types phức tạp.`,
        },
    },
    {
        title: 'Generics trong TypeScript hoạt động thế nào và làm sao để áp dụng ràng buộc (generic constraints)?',
        slug: 'typescript-generics-and-type-constraints',
        difficulty: client_1.Difficulty.MEDIUM,
        categorySlug: 'frontend-development',
        techSlug: 'typescript',
        content: `Giải thích về Generics trong TypeScript. Làm thế nào để tạo các hàm và lớp tái sử dụng an toàn kiểu (type-safe), đồng thời giới hạn kiểu dữ liệu bằng từ khóa \`extends\`?`,
        answer: {
            content: `Generics cho phép tạo ra các component hoạt động linh hoạt trên nhiều kiểu dữ liệu khác nhau mà vẫn giữ nguyên thông tin an toàn kiểu (type safety). Ràng buộc Generic (\`T extends KnownShape\`) giúp giới hạn các kiểu dữ liệu có thể truyền vào thông số generic đó.`,
            codeSnippet: `interface Lengthwise {
  length: number;
}

// Bắt buộc T phải có thuộc tính .length
function logLength<T extends Lengthwise>(arg: T): number {
  console.log(arg.length);
  return arg.length;
}

logLength('Hello World'); // Hợp lệ (string có thuộc tính length)
logLength([1, 2, 3]);    // Hợp lệ (array có thuộc tính length)
// logLength(123);       // Lỗi: number không có thuộc tính .length`,
            explanation: `Generic constraints giúp ngăn ngừa lỗi runtime bằng cách đảm bảo biến generic truyền vào phải thỏa mãn cấu trúc interface tối thiểu trước khi biên dịch code.`,
        },
    },
    {
        title: 'Virtual DOM là gì và cơ chế Reconciliation trong React hoạt động như thế nào?',
        slug: 'react-virtual-dom-reconciliation-fiber',
        difficulty: client_1.Difficulty.HARD,
        categorySlug: 'frontend-development',
        techSlug: 'react',
        content: `Mô tả cách React duy trì một bản sao thu nhỏ của real DOM trong bộ nhớ. Giải thích về kiến trúc React Fiber, thuật toán Diffing Heuristic và quá trình gom nhóm cập nhật (batch updates).`,
        answer: {
            content: `Virtual DOM (VDOM) là một cấu trúc cây nhẹ nằm trên bộ nhớ mô phỏng lại các DOM node thực tế. Khi state của component thay đổi, React sẽ tạo một cây VDOM mới và so sánh với cây VDOM cũ bằng thuật toán Diffing (độ phức tạp O(n)). Sau đó, nó sẽ gom nhóm các thay đổi tối thiểu và áp dụng lên real DOM ở giai đoạn Commit phase.`,
            codeSnippet: `// Quy tắc Heuristic:
// 1. Hai element khác kiểu sẽ tạo ra hai cây hoàn toàn khác nhau
// 2. Key giúp React định danh đúng các phần tử con qua mỗi lần render:
<ul>
  {items.map((item) => (
    <li key={item.id}>{item.name}</li>
  ))}
</ul>`,
            explanation: `Kiến trúc React Fiber cho phép chia nhỏ công việc rendering thành nhiều đơn vị công việc (units of work) có thể tạm dừng, hủy bỏ hoặc ưu tiên tùy theo khung hình của trình duyệt và tương tác của người dùng.`,
        },
    },
    {
        title: 'Giải thích Quy tắc của Hooks (Rules of Hooks) trong React và tại sao không được gọi Hook trong vòng lặp hay câu lệnh điều kiện?',
        slug: 'react-rules-of-hooks-execution-order',
        difficulty: client_1.Difficulty.EASY,
        categorySlug: 'frontend-development',
        techSlug: 'react',
        content: `Tại sao các React Hook bắt buộc phải được gọi ở tầng trên cùng (top-level) của component function? React theo dõi state của các Hook qua mỗi lần re-render bằng cách nào?`,
        answer: {
            content: `React phụ thuộc hoàn toàn vào thứ tự gọi của các Hook qua mỗi lần render. Bên trong, React lưu trữ các Hook dưới dạng một danh sách liên kết (linked list) gắn liền với Fiber node của component. Nếu gọi Hook bên trong câu lệnh điều kiện, thứ tự gọi sẽ bị xáo trộn, gây ra tình trạng sai lệch state và rò rỉ bộ nhớ.`,
            codeSnippet: `// ❌ SAI: Gọi Hook trong câu lệnh điều kiện
function Component({ isLoaded }) {
  if (isLoaded) {
    useEffect(() => {}, []); // Thứ tự bị thay đổi theo prop!
  }
}

// ✅ ĐÚNG: Gọi Hook ở top level
function Component({ isLoaded }) {
  useEffect(() => {
    if (!isLoaded) return;
    // Logic effect đặt ở đây
  }, [isLoaded]);
}`,
            explanation: `Do state của Hook được lấy ra theo thứ tự tuyến tính của lần gọi chứ không theo tên biến, việc đặt Hook trong \`if\` hay vòng lặp sẽ phá vỡ chỉ số truy xuất của React ở các lần render tiếp theo.`,
        },
    },
    {
        title: 'useMemo và useCallback hoạt động như thế nào trong React và khi nào thì KHÔNG nên sử dụng chúng?',
        slug: 'react-usememo-usecallback-performance-optimization',
        difficulty: client_1.Difficulty.MEDIUM,
        categorySlug: 'frontend-development',
        techSlug: 'react',
        content: `Phân biệt sự khác nhau giữa \`useMemo\` và \`useCallback\`. Những đánh đổi về mặt hiệu năng (performance trade-offs) là gì và tại sao việc lạm dụng chúng lại gây tác dụng ngược?`,
        answer: {
            content: `\`useMemo\` lưu lại *kết quả* tính toán của một hàm tốn chi phí xử lý, trong khi \`useCallback\` lưu lại *chính bản thân hàm (function reference)* giữa các lần render. Việc lạm dụng chúng tạo ra chi phí phụ vì React vẫn phải khởi tạo mảng dependency và so sánh bộ nhớ qua từng lần render.`,
            codeSnippet: `// Lưu trữ giá trị tính toán nặng
const expensiveValue = useMemo(() => computeHeavyTask(data), [data]);

// Lưu trữ reference của hàm để tránh làm re-render component con (khi dùng React.memo)
const handleClick = useCallback(() => {
  doAction(id);
}, [id]);`,
            explanation: `Chỉ nên dùng \`useMemo\` cho các phép tính thực sự nặng (như lọc array dung lượng lớn) và \`useCallback\` khi truyền callback xuống component con được bọc bởi \`React.memo\`. Tránh tối ưu hóa sớm cho các thao tác tính toán thông thường.`,
        },
    },
    {
        title: 'Sự khác biệt giữa Server Components và Client Components trong App Router của Next.js là gì?',
        slug: 'nextjs-server-components-vs-client-components',
        difficulty: client_1.Difficulty.MEDIUM,
        categorySlug: 'web-architecture-performance',
        techSlug: 'nextjs',
        content: `So sánh React Server Components (RSC) và Client Components ('use client') trong Next.js. Sự khác biệt về dung lượng bundle size, bảo mật và khả năng fetch dữ liệu là gì?`,
        answer: {
            content: `Server Components được render hoàn toàn ở phía Server và không gửi bất kỳ dòng mã JavaScript nào xuống Client bundle. Chúng có thể truy cập trực tiếp vào CSDL và các biến môi trường bí mật. Client Components (\`'use client'\`) được pre-render ở Server và tiến hành hydration trên Client, hỗ trợ state, effect và các sự kiện người dùng trên trình duyệt.`,
            codeSnippet: `// Server Component (Mặc định trong App Router)
// Truy cập trực tiếp DB, 0 KB client JS bundle
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
            explanation: `Nên giữ các component dưới dạng Server Component theo mặc định để giảm kích thước bundle JavaScript gửi xuống trình duyệt, giúp cải thiện chỉ số Core Web Vitals. Chỉ đẩy ranh giới \`'use client'\` xuống các phần tử tương tác nhỏ nhất ở tầng dưới.`,
        },
    },
    {
        title: 'Node.js xử lý đồng thời (concurrency) như thế nào mặc dù chỉ chạy trên một đơn luồng (single-threaded)?',
        slug: 'nodejs-concurrency-libuv-worker-threads',
        difficulty: client_1.Difficulty.MEDIUM,
        categorySlug: 'backend-development',
        techSlug: 'nodejs',
        content: `Giải thích kiến trúc bất đồng bộ của Node.js. Trình bày về thread pool của Libuv, cơ chế non-blocking I/O polling và Worker Threads dành cho các tác vụ nặng về CPU.`,
        answer: {
            content: `Node.js thực thi mã JavaScript trên một luồng duy nhất, nhưng ủy quyền (delegate) các tác vụ I/O bất đồng bộ (đọc ghi file, gọi mạng, mã hóa) cho kernel của hệ điều hành hoặc cho thread pool chạy ngầm của Libuv (mặc định 4 threads). Khi tác vụ I/O hoàn thành, Libuv đẩy callback tương ứng vào Event Loop.`,
            codeSnippet: `const fs = require('fs');

console.log('1. Start');

// Ủy quyền cho Libuv thread pool (không chặn luồng chính)
fs.readFile('large-file.txt', 'utf8', (err, data) => {
  console.log('3. Đã đọc xong file');
});

console.log('2. End');

// Thứ tự Output: 1. Start -> 2. End -> 3. Đã đọc xong file`,
            explanation: `Node.js có thể xử lý hàng ngàn request HTTP đồng thời rất hiệu quả vì các lệnh I/O không làm nghẽn (block) luồng chính. Với các tác vụ nặng về CPU (như xử lý video, nén file), lập trình viên nên sử dụng Worker Threads hoặc Message Queue bên ngoài.`,
        },
    },
    {
        title: 'Phân biệt sự khác nhau giữa process.nextTick() và setImmediate() trong Node.js?',
        slug: 'nodejs-process-nexttick-vs-setimmediate',
        difficulty: client_1.Difficulty.HARD,
        categorySlug: 'backend-development',
        techSlug: 'nodejs',
        content: `So sánh thứ tự thực thi của \`process.nextTick()\` và \`setImmediate()\` qua các giai đoạn của Event Loop trong Node.js. Nguy cơ nào xảy ra khi gọi \`nextTick\` đệ quy?`,
        answer: {
            content: `\`process.nextTick()\` sẽ kích hoạt ngay lập tức sau khi thao tác đồng bộ hiện tại kết thúc, trước khi Event Loop chuyển sang phase tiếp theo. Còn \`setImmediate()\` sẽ xếp callback vào Check phase của Event Loop (sau khi các sự kiện I/O được xử lý).`,
            codeSnippet: `setImmediate(() => console.log('setImmediate'));

process.nextTick(() => console.log('nextTick'));

console.log('Main context');

// Output:
// Main context
// nextTick
// setImmediate`,
            explanation: `Việc gọi đệ quy \`process.nextTick()\` liên tục sẽ làm nghẽn (starve) Event Loop, khiến cho các thao tác I/O và Timer khác hoàn toàn không thể thực thi!`,
        },
    },
    {
        title: 'Giải thích cơ chế Dependency Injection (DI) trong NestJS và cách hoạt động ngầm của decorator @Injectable()?',
        slug: 'nestjs-dependency-injection-provider-lifecycle',
        difficulty: client_1.Difficulty.MEDIUM,
        categorySlug: 'backend-development',
        techSlug: 'nestjs',
        content: `Mô tả về container Inversion of Control (IoC) trong NestJS. Metadata của TypeScript (\`reflect-metadata\`) hỗ trợ NestJS tự động inject các dependency như thế nào?`,
        answer: {
            content: `NestJS sử dụng thiết kế Inversion of Control (IoC) để quản lý phụ thuộc tự động. Khi một class được gắn \`@Injectable()\`, NestJS đăng ký nó như một Provider trong scope của module. Trong quá trình khởi chạy, NestJS đọc kiểu dữ liệu trong constructor của class nhờ \`reflect-metadata\` và tự động tiêm (inject) các instance singleton vào.`,
            codeSnippet: `@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.question.findMany();
  }
}

@Controller('questions')
export class QuestionsController {
  // NestJS IoC tự động tiêm QuestionsService vào đây
  constructor(private readonly questionsService: QuestionsService) {}
}`,
            explanation: `Dependency Injection giúp tách rời việc khởi tạo đối tượng khỏi mã nghiệp vụ, đơn giản hóa việc viết Unit Test (bằng cách dễ dàng thay thế bằng Mock Provider) và quản lý vòng đời của Singleton một cách sạch sẽ.`,
        },
    },
    {
        title: 'Phân biệt sự khác nhau giữa Guards, Interceptors, Pipes và Middleware trong NestJS?',
        slug: 'nestjs-guards-interceptors-pipes-middleware-execution-order',
        difficulty: client_1.Difficulty.HARD,
        categorySlug: 'backend-development',
        techSlug: 'nestjs',
        content: `Trình bày chi tiết thứ tự thực thi của Middleware, Guards, Interceptors, Pipes và Exception Filters trong vòng đời một request-response của NestJS.`,
        answer: {
            content: `Thứ tự xử lý một request trong NestJS diễn ra theo các bước:
1. **Middleware**: Xử lý request thô ở tầng Express/Fastify (logging, parse body).
2. **Guards**: Kiểm tra xác thực & phân quyền (Authentication & Authorization - \`CanActivate\`).
3. **Interceptors (Trước controller)**: Bắt request, biến đổi dữ liệu đầu vào.
4. **Pipes**: Validate và transform dữ liệu (như \`ValidationPipe\`).
5. **Controller Handler**: Thực thi logic nghiệp vụ.
6. **Interceptors (Sau controller)**: Biến đổi dữ liệu response đầu ra hoặc ghi cache.
7. **Exception Filters**: Bắt và định dạng các lỗi chưa được xử lý thành HTTP Response chuẩn.`,
            codeSnippet: `// Ví dụ về Guard
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.user?.role === 'ADMIN';
  }
}`,
            explanation: `Hiểu rõ thứ tự vòng đời giúp tránh các lỗi như cố gắng đọc dữ liệu DTO đã validate bên trong Middleware trước khi Pipes kịp transform nó.`,
        },
    },
    {
        title: 'Phân biệt sự khác nhau giữa INNER JOIN, LEFT JOIN và FULL OUTER JOIN trong PostgreSQL?',
        slug: 'postgresql-inner-left-right-full-outer-joins',
        difficulty: client_1.Difficulty.EASY,
        categorySlug: 'database-storage',
        techSlug: 'postgresql',
        content: `Giải thích các phép JOIN trong SQL. Cho ví dụ thể hiện sự khác biệt về tập kết quả khi truy vấn giữa các bảng có mối quan hệ trong PostgreSQL.`,
        answer: {
            content: `\`INNER JOIN\` chỉ trả về các dòng có khóa khớp ở cả 2 bảng. \`LEFT JOIN\` trả về tất cả các dòng của bảng bên trái và các dòng khớp của bảng bên phải (nếu không khớp sẽ điền \`NULL\`). \`FULL OUTER JOIN\` trả về tất cả các dòng từ cả 2 bảng, điền \`NULL\` cho những vị trí không tìm thấy bản ghi tương ứng.`,
            codeSnippet: `-- INNER JOIN: Chỉ lấy những câu hỏi có author
SELECT q.title, u.email 
FROM "Question" q 
INNER JOIN "User" u ON q."authorId" = u.id;

-- LEFT JOIN: Lấy tất cả câu hỏi, kể cả những câu không có author (authorId là NULL)
SELECT q.title, u.email 
FROM "Question" q 
LEFT JOIN "User" u ON q."authorId" = u.id;`,
            explanation: `Sử dụng \`LEFT JOIN\` khi dữ liệu bảng liên kết là tùy chọn không bắt buộc (optional) và dùng \`INNER JOIN\` khi bắt buộc phải có bản ghi liên kết ở cả hai bên.`,
        },
    },
    {
        title: 'Database Index (B-Tree) giúp tối ưu tốc độ truy vấn trong PostgreSQL như thế nào?',
        slug: 'postgresql-b-tree-indexes-query-performance',
        difficulty: client_1.Difficulty.MEDIUM,
        categorySlug: 'database-storage',
        techSlug: 'postgresql',
        content: `Giải thích về B-Tree Index trong PostgreSQL. Cách chỉ mục chuyển đổi từ quét tuần tự O(N) (Sequential Scan) thành O(log N) và những chi phí đánh đổi khi ghi dữ liệu?`,
        answer: {
            content: `B-Tree Index duy trì một cấu trúc cây tự cân bằng chứa các giá trị khóa chỉ mục trỏ đến các vị trí lưu trữ thực tế trên đĩa (heap tuples). Việc tìm kiếm trên cột có Index giúp PostgreSQL tìm thấy dòng dữ liệu trong thời gian O(log N) thay vì quét toàn bộ bảng O(N). Tuy nhiên, mỗi Index sẽ làm tăng chi phí khi thực hiện các thao tác \`INSERT\`, \`UPDATE\` và \`DELETE\`.`,
            codeSnippet: `-- Tạo composite index để lọc theo khó và danh mục
CREATE INDEX "idx_question_diff_cat" 
ON "Question" ("categoryId", "difficulty");

-- PostgreSQL query optimizer sẽ tận dụng index này khi chạy:
SELECT * FROM "Question" 
WHERE "categoryId" = '123' AND "difficulty" = 'HARD';`,
            explanation: `Nên tạo Index cho các cột khóa ngoại (Foreign Keys) và các trường thường xuyên xuất hiện trong điều kiện \`WHERE\`, \`ORDER BY\` và \`JOIN\`, nhưng tránh tạo quá nhiều Index trên các bảng có tần suất ghi dữ liệu cao.`,
        },
    },
    {
        title: 'Các trường hợp sử dụng (use cases) phổ biến của Redis trong kiến trúc ứng dụng web là gì?',
        slug: 'redis-use-cases-caching-session-rate-limiting',
        difficulty: client_1.Difficulty.EASY,
        categorySlug: 'database-storage',
        techSlug: 'redis',
        content: `Tại sao Redis thường được sử dụng song song với các CSDL quan hệ như PostgreSQL? Trình bày các use case gồm caching, lưu trữ session, pub/sub và giới hạn tốc độ (rate limiting).`,
        answer: {
            content: `Redis là hệ quản trị dữ liệu key-value lưu trên RAM mang lại tốc độ phản hồi cực nhanh dưới 1 millisecond. Các use case chính bao gồm: 1) Caching kết quả truy vấn đắt đỏ từ CSDL, 2) Quản lý Session người dùng, 3) Cài đặt Rate Limiter chống Spam, và 4) Làm hàng đợi Message Queue với Pub/Sub hoặc Streams.`,
            codeSnippet: `// Ví dụ Caching với Node.js + Redis
async function getQuestionBySlug(slug) {
  const cached = await redis.get(\`question:\${slug}\`);
  if (cached) return JSON.parse(cached);

  const question = await prisma.question.findUnique({ where: { slug } });
  await redis.set(\`question:\${slug}\`, JSON.stringify(question), 'EX', 3600); // Lưu cache 1 giờ (TTL)
  return question;
}`,
            explanation: `Caching trên bộ nhớ RAM giúp giảm tải các câu lệnh đọc trùng lặp xuống CSDL PostgreSQL, từ đó giảm đáng kể CPU load cho database chính và tăng tốc độ phản hồi API.`,
        },
    },
    {
        title: 'Làm thế nào để cài đặt Khóa phân tán (Distributed Lock) hoặc Rate Limiter bằng Redis trong Node.js?',
        slug: 'redis-distributed-lock-rate-limiter-implementation',
        difficulty: client_1.Difficulty.HARD,
        categorySlug: 'database-storage',
        techSlug: 'redis',
        content: `Giải thích thuật toán Redlock cho Distributed Lock và mô hình Sliding Window cho API Rate Limiting bằng các lệnh nguyên tử (atomic operations) của Redis (\`INCR\`, \`EXPIRE\`, Lua Script).`,
        answer: {
            content: `Để cài đặt Rate Limiter hoặc Distributed Lock an toàn giữa nhiều node server backend, Redis sử dụng các lệnh nguyên tử hoặc Lua script. Khóa phân tán sử dụng cú pháp \`SET key value NX PX milliseconds\` để chỉ tạo key khi nó chưa tồn tại, giúp đảm bảo không bị tranh chấp dữ liệu giữa các microservice.`,
            codeSnippet: `// Lấy khóa nguyên tử trong Redis
const acquired = await redis.set(
  'lock:question:update:123',
  instanceId,
  'NX', // Chỉ set nếu chưa tồn tại (Not eXists)
  'PX', 10000 // Tự giải phóng sau 10 giây để tránh deadlock
);

if (acquired === 'OK') {
  // Thực thi phần mã quan trọng
}`,
            explanation: `Các lệnh nguyên tử và Lua script chạy trong một bước duy nhất bên trong luồng đơn của Redis, giúp tránh hoàn toàn hiện tượng race condition giữa các microservice độc lập.`,
        },
    },
    {
        title: 'Phân biệt Docker Image với Container, và cơ chế Multi-Stage Build hoạt động như thế nào?',
        slug: 'docker-images-containers-multi-stage-builds',
        difficulty: client_1.Difficulty.EASY,
        categorySlug: 'devops-infrastructure',
        techSlug: 'docker',
        content: `So sánh Docker Image và Container. Giải thích cách Multi-Stage \`Dockerfile\` tối ưu kích thước image production bằng cách loại bỏ các dev dependency.`,
        answer: {
            content: `Docker Image là một bản thiết kế (blueprint) chỉ đọc chứa mã nguồn, thư viện và cấu hình ứng dụng. Docker Container là một thể hiện (instance) đang chạy của Image đó. Multi-stage build cho phép dùng nhiều câu lệnh \`FROM\` trong một file \`Dockerfile\` để biên dịch ở stage đầu tiên và chỉ copy những file chạy thực tế sang stage final gọn nhẹ.`,
            codeSnippet: `# Stage 1: Build stage (Biên dịch code)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production runner stage (Dung lượng siêu nhẹ)
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]`,
            explanation: `Multi-stage build giúp giảm kích thước Docker Image từ hơn 1GB xuống chỉ còn ~100MB nhờ việc bỏ lại toàn bộ file TypeScript gốc, trình biên dịch và các devDependencies không cần thiết khi chạy thực tế.`,
        },
    },
    {
        title: 'Tính chất ACID trong CSDL quan hệ là gì và PostgreSQL xử lý các mức cô lập (Isolation levels) ra sao?',
        slug: 'postgresql-acid-properties-transaction-isolation-levels',
        difficulty: client_1.Difficulty.HARD,
        categorySlug: 'database-storage',
        techSlug: 'postgresql',
        content: `Giải thích tính chất Atomicity, Consistency, Isolation, và Durability (ACID). Chi tiết về các hiện tượng đọc sai (Dirty Read, Non-Repeatable Read, Phantom Read) và mức cô lập trong PostgreSQL.`,
        answer: {
            content: `ACID đảm bảo tính tin cậy của các giao dịch (transaction) trong CSDL. Atomicity (Tính nguyên tố: được tất cả hoặc không được gì). Consistency (Tính nhất quán). Isolation (Tính cô lập: nhờ cơ chế MVCC). Durability (Tính bền vững: dữ liệu sau commit sẽ được ghi vĩnh viễn xuống đĩa).`,
            codeSnippet: `-- Thiết lập mức cô lập transaction trong PostgreSQL
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;

UPDATE "Account" SET balance = balance - 100 WHERE id = 'user-1';
UPDATE "Account" SET balance = balance + 100 WHERE id = 'user-2';

COMMIT;`,
            explanation: `Mức cô lập mặc định của PostgreSQL là Read Committed. Việc nâng lên Repeatable Read hoặc Serializable giúp ngăn chặn hoàn toàn hiện tượng đọc bóng ma (Phantom Read) nhưng sẽ làm tăng khả năng bị xung đột transaction yêu cầu phía client phải retry.`,
        },
    },
    {
        title: 'Docker Networking hoạt động như thế nào và sự khác biệt giữa các chế độ bridge, host và overlay network?',
        slug: 'docker-networking-bridge-host-overlay',
        difficulty: client_1.Difficulty.MEDIUM,
        categorySlug: 'devops-infrastructure',
        techSlug: 'docker',
        content: `So sánh các driver mạng trong Docker: Bridge, Host và Overlay. Khi nào nên dùng từng chế độ cho container đơn lẻ hoặc cụm Docker Swarm?`,
        answer: {
            content: `Bridge là driver mạng mặc định cho các container trên cùng 1 host, cách ly IP của container sau một mạng NAT. Host mode chia sẻ trực tiếp stack mạng với máy host (không mất chi phí port mapping). Overlay mode cho phép các container nằm ở nhiều máy chủ vật lý khác nhau trong cụm Docker Swarm kết nối trực tiếp với nhau.`,
            codeSnippet: `# Tạo một mạng bridge riêng biệt
docker network create vinterview-net

# Chạy container gắn vào mạng riêng
docker run -d --name api-service --network vinterview-net api-image`,
            explanation: `Sử dụng mạng Bridge do người dùng tự định nghĩa sẽ cho phép các container tự động phân giải tên miền DNS theo tên container (ví dụ: \`api-service\` tự trỏ đúng IP mà không cần hardcode).`,
        },
    },
    {
        title: 'Thuật toán Rate Limiting trong System Design: Phân biệt Token Bucket, Leaky Bucket và Sliding Window Log?',
        slug: 'system-design-rate-limiting-algorithms-token-leaky-bucket',
        difficulty: client_1.Difficulty.HARD,
        categorySlug: 'software-architecture-system-design',
        techSlug: 'rest-api',
        content: `Trình bày nguyên lý hoạt động của các thuật toán Rate Limiting phổ biến: Token Bucket, Leaky Bucket, Fixed Window Counter và Sliding Window Log. Chọn giải pháp tối ưu cho hệ thống API Gateway xử lý traffic đột biến (traffic bursts).`,
        answer: {
            content: `Rate Limiting bảo vệ API khỏi các cuộc tấn công DoS/DDoS và hiện tượng quá tải.
- **Token Bucket**: Cung cấp số lượng token cố định vào bucket theo chu kỳ. Khi request đến, hệ thống rút 1 token. Nếu hết token, request bị từ chối (429 Too Many Requests). Cho phép xử lý linh hoạt các đợt traffic burst đột biến.
- **Leaky Bucket**: Request vào được xếp vào hàng đợi (queue) FIFO và xử lý với tốc độ cố định ra ngoài (constant rate). Loại bỏ hoàn toàn traffic burst, giúp output luôn ổn định.
- **Sliding Window Log**: Lưu timestamp của mỗi request vào Redis Sorted Set và đếm số request trong khoảng thời gian cửa sổ trượt (sliding window). Độ chính xác tuyệt đối nhưng tốn bộ nhớ lưu trữ.`,
            codeSnippet: `// Ví dụ triển khai Token Bucket cơ bản bằng Redis Lua Script
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local current = tonumber(redis.call('get', key) or "0")

if current + 1 > limit then
    return 0 -- Rate limit exceeded
else
    redis.call("INCRBY", key, 1)
    redis.call("EXPIRE", key, 60)
    return 1 -- Allowed
end`,
            explanation: `Hầu hết các hệ thống API Gateway hiện đại (như Nginx, Kong, Amazon API Gateway) sử dụng thuật toán Token Bucket hoặc Leaky Bucket kết hợp với Redis cluster để đảm bảo độ trễ thấp và khả năng mở rộng ngang (horizontal scaling).`,
        },
    },
    {
        title: 'So sánh các cơ chế giao tiếp giữa các Microservices: REST API vs gRPC vs Message Broker (Kafka/RabbitMQ)?',
        slug: 'microservices-communication-rest-grpc-kafka-rabbitmq',
        difficulty: client_1.Difficulty.HARD,
        categorySlug: 'software-architecture-system-design',
        techSlug: 'grpc',
        content: `Phân tích hai mô hình giao tiếp Synchronous (REST/gRPC) và Asynchronous (Message Broker). Khi nào nên dùng gRPC thay cho REST API và khi nào dùng Event-Driven với Kafka/RabbitMQ?`,
        answer: {
            content: `Trong kiến trúc Microservices:
- **REST API (HTTP/1.1 + JSON)**: Phù hợp cho giao tiếp bên ngoài (External Client-to-Backend), đơn giản, chuẩn hóa cao nhưng payload JSON nặng và có latency cao hơn.
- **gRPC (HTTP/2 + Protocol Buffers)**: Phù hợp cho giao tiếp nội bộ (Internal Service-to-Service). Nhờ định dạng Protocol Buffers binary cực nhẹ và tính năng Streaming của HTTP/2, gRPC nhanh gấp 5-10 lần so với REST.
- **Message Broker (Event-Driven)**: Sử dụng Kafka hoặc RabbitMQ cho giao tiếp bất đồng bộ, giúp decouples các service. Service gửi Event và tiếp tục công việc mà không cần chờ kết quả (Non-blocking).`,
            codeSnippet: `// Định nghĩa gRPC Service bằng Protocol Buffers (.proto)
syntax = "proto3";

package payment;

service PaymentService {
  rpc ProcessPayment (PaymentRequest) returns (PaymentResponse);
}

message PaymentRequest {
  string order_id = 1;
  double amount = 2;
}

message PaymentResponse {
  string status = 1;
  string transaction_id = 2;
}`,
            explanation: `Nguyên tắc thiết kế hệ thống Microservices hiện đại: Sử dụng REST API cho Public API, gRPC cho Synchronous Internal Calls (yêu cầu độ trễ cực thấp), và Kafka/RabbitMQ cho Asynchronous Event-Driven Workflows (xử lý đơn hàng, gửi mail, thanh toán).`,
        },
    },
    {
        title: 'Các chiến lược Caching phổ biến (Cache-Aside, Write-Through, Write-Back) và cách giải quyết bài toán Cache Stampede?',
        slug: 'caching-strategies-cache-aside-write-through-cache-stampede',
        difficulty: client_1.Difficulty.HARD,
        categorySlug: 'software-architecture-system-design',
        techSlug: 'redis',
        content: `So sánh 3 chiến lược caching: Cache-Aside, Write-Through và Write-Back. Hiện tượng Cache Stampede (Thundering Herd) là gì và làm sao để khắc phục?`,
        answer: {
            content: `Chiến lược Caching:
- **Cache-Aside (Lazy Loading)**: Ứng dụng kiểm tra Cache trước. Nếu Hit -> trả về dữ liệu. Nếu Miss -> truy vấn CSDL, ghi vào Cache rồi trả về. Phổ biến nhất.
- **Write-Through**: Khi cập nhật dữ liệu, ứng dụng ghi đồng thời vào Cache và CSDL. Đảm bảo tính nhất quán dữ liệu nhưng latency ghi cao hơn.
- **Write-Back (Write-Behind)**: Ghi vào Cache ngay lập tức và đưa dữ liệu vào hàng đợi để ghi xuống CSDL sau. Tốc độ ghi cực nhanh nhưng có rủi ro mất dữ liệu nếu Cache sập.

**Cache Stampede**: Xảy ra khi một cache key có lượt truy cập cao bị hết hạn (expired), hàng ngàn request đồng thời đổ dồn xuống CSDL gây sập database.`,
            codeSnippet: `// Khắc phục Cache Stampede bằng Mutex Lock (Singleflight / Distributed Lock)
async function getOrSetCache(key, fetchDbFn) {
  let data = await redis.get(key);
  if (!data) {
    const lockAcquired = await redis.set(\`lock:\${key}\`, '1', 'NX', 'EX', 10);
    if (lockAcquired) {
      data = await fetchDbFn();
      await redis.set(key, JSON.stringify(data), 'EX', 3600);
      await redis.del(\`lock:\${key}\`);
    } else {
      // Chờ 50ms và thử lấy lại từ cache
      await new Promise(r => setTimeout(r, 50));
      return getOrSetCache(key, fetchDbFn);
    }
  }
  return typeof data === 'string' ? JSON.parse(data) : data;
}`,
            explanation: `Để ngăn chặn Cache Stampede, ta có thể dùng Distributed Locking (Redis Lock), áp dụng Probabilistic Early Expiration (XFetch algorithm) hoặc chạy Cron Job chủ động warm-up cache trước khi key hết hạn.`,
        },
    },
    {
        title: 'API Gateway khác gì so với Reverse Proxy (Nginx, HAProxy) trong kiến trúc Microservices?',
        slug: 'api-gateway-vs-reverse-proxy-nginx-microservices',
        difficulty: client_1.Difficulty.MEDIUM,
        categorySlug: 'software-architecture-system-design',
        techSlug: 'rest-api',
        content: `Phân biệt vai trò của Reverse Proxy (như Nginx, HAProxy) và API Gateway (như Kong, AWS API Gateway, NestJS Gateway). Khi nào nên kết hợp cả hai?`,
        answer: {
            content: `Reverse Proxy chủ yếu hoạt động ở Layer 4 (Transport) và Layer 7 (Application) để định tuyến Network Traffic, Load Balancing, SSL Termination và Static Content Caching với hiệu năng cực cao bằng C/C++.

API Gateway nằm trên tầm của Reverse Proxy, đảm nhận thêm các nghiệp vụ Application Layer chuyên sâu cho Microservices như:
- Authentication & Authorization (Validate JWT, OAuth2).
- Dynamic Rate Limiting & Quota Management.
- Request/Response Transformation (Payload Aggregation).
- Service Discovery Integration (Eureka, Consul).
- Centralized Logging & Metrics (Prometheus/Grafana).`,
            codeSnippet: `// Nginx làm Reverse Proxy & Load Balancer
upstream backend_cluster {
    least_conn;
    server api-node-1.internal:4000;
    server api-node-2.internal:4000;
}

server {
    listen 80;
    server_name api.vinterview.vn;

    location / {
        proxy_pass http://backend_cluster;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}`,
            explanation: `Trong kiến trúc thực tế lớn, Nginx thường đóng vai trò là Edge Reverse Proxy tiếp nhận traffic đầu vào từ Internet (giao tiếp SSL), sau đó forward sang API Gateway để xử lý logic định danh, phân quyền và routing đến các Microservices phía sau.`,
        },
    },
    {
        title: 'Goroutines và Channels trong Golang hoạt động như thế nào và khác biệt gì so với OS Threads?',
        slug: 'golang-goroutines-channels-concurrency-vs-os-threads',
        difficulty: client_1.Difficulty.HARD,
        categorySlug: 'backend-development',
        techSlug: 'golang',
        content: `Giải thích mô hình Concurrency M:N Scheduler trong Go. Phân biệt Goroutine với OS Thread về kích thước bộ nhớ (stack size), chi phí context switch và giao tiếp bằng Channels.`,
        answer: {
            content: `Golang sử dụng mô hình lập trình đồng thời (Concurrency) dựa trên CSP (Communicating Sequential Processes):
- **Goroutine**: Là luồng ảo (lightweight thread) được quản lý bởi Go Runtime Scheduler. Một Goroutine khởi tạo chỉ tốn khoảng 2KB stack (có thể tự động co giãn), trong khi OS Thread tốn tới 1MB-2MB.
- **M:N Scheduler**: M Goroutines được map vào N OS Threads thông qua mô hình GMP (Goroutine - Machine - Processor). Context switch giữa các Goroutines xảy ra ở User Space nên cực kỳ nhanh.
- **Channels**: Cho phép truyền dữ liệu an toàn giữa các Goroutines mà không cần dùng Mutex Lock ("Don't communicate by sharing memory; share memory by communicating").`,
            codeSnippet: `package main
import ("fmt"; "time")

func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)

    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results) // Khởi tạo 3 Goroutines
    }

    for j := 1; j <= 5; j++ { jobs <- j }
    close(jobs)

    for a := 1; a <= 5; a++ {
        fmt.Println(<-results)
    }
}`,
            explanation: `Nhờ chi phí bộ nhớ cực thấp và bộ điều phối GMP Scheduler thông minh, một ứng dụng Go có thể chạy đồng thời hàng trăm nghìn Goroutines trên một cỗ máy bình thường mà không gây cạn kiệt tài nguyên hệ thống.`,
        },
    },
    {
        title: 'Mô hình bộ nhớ JVM (Heap, Stack, Metaspace) và cơ chế Garbage Collection trong Java hoạt động như thế nào?',
        slug: 'java-jvm-memory-model-heap-stack-garbage-collection',
        difficulty: client_1.Difficulty.HARD,
        categorySlug: 'backend-development',
        techSlug: 'java',
        content: `Phân tích cấu trúc bộ nhớ JVM (Java Virtual Machine): Heap Space, Thread Stack, Metaspace. Nguyên lý thu gom rác (Garbage Collection) với các thuật toán Mark-and-Sweep, Young Generation (Eden, Survivor) và Tenured Generation?`,
        answer: {
            content: `Bộ nhớ JVM được chia làm 3 vùng chính:
- **Thread Stack**: Lưu trữ các biến cục bộ (primitives) và reference đến objects. Mỗi luồng có một Stack riêng biệt.
- **Heap Space**: Nơi chứa toàn bộ Object instances và Array. Được chia thành Young Generation (Eden Space, S0, S1) và Old/Tenured Generation.
- **Metaspace**: Chứa thông tin Metadata của Class, phương thức và hằng số (thay thế PermGen từ Java 8).

**Garbage Collection (GC)**:
1. **Minor GC**: Thu gom các Object ngắn hạn ở Eden Space. Object sống sót qua nhiều lần Minor GC sẽ được di chuyển lên Old Generation.
2. **Major/Full GC**: Thu gom trên toàn bộ Old Generation (gây ra hiện tượng Stop-The-World ngắn). Các bộ GC hiện đại như G1GC, ZGC giảm thiểu tối đa thời gian tạm dừng ứng dụng.`,
            codeSnippet: `public class MemoryDemo {
    // Stored in Heap
    private String name = "Vinterview";

    public void processData() {
        // 'localVal' stored in Thread Stack
        int localVal = 100;
        
        // Object created in Heap, reference stored in Stack
        User user = new User("Admin");
    }
}`,
            explanation: `Hiểu rõ JVM Memory Model giúp lập trình viên Java tối ưu tham số JVM (-Xms, -Xmx), chọn bộ GC phù hợp (G1GC hoặc ZGC) và tránh các lỗi kinh điển như java.lang.OutOfMemoryError: Java heap space.`,
        },
    },
    {
        title: 'Global Interpreter Lock (GIL) trong Python là gì và nó ảnh hưởng thế nào đến ứng dụng đa luồng (Multi-threading)?',
        slug: 'python-global-interpreter-lock-gil-multithreading',
        difficulty: client_1.Difficulty.MEDIUM,
        categorySlug: 'backend-development',
        techSlug: 'python',
        content: `Giải thích lý do CPython cần Global Interpreter Lock (GIL). Phân biệt sự khác nhau giữa Multi-threading và Multi-processing khi thực thi tác vụ CPU-bound so với I/O-bound trong Python.`,
        answer: {
            content: `Global Interpreter Lock (GIL) là cơ chế Mutex trong CPython ngăn nhiều luồng (threads) cùng thực thi mã bytecode Python tại một thời điểm trên đa nhân CPU.

- **CPU-Bound Tasks** (tính toán toán học, xử lý ảnh, AI): Multi-threading trong Python không làm tăng tốc độ thực thi do GIL khóa execution. Giải pháp là dùng module multiprocessing (mỗi process có GIL riêng) hoặc viết bằng C-extension.
- **I/O-Bound Tasks** (đọc ghi file, gọi API, database query): Multi-threading hoặc Asyncio (async/await) rất hiệu quả vì GIL được giải phóng khi luồng đang chờ kết quả I/O.`,
            codeSnippet: `import asyncio
import aiohttp

# Tối ưu I/O Bound bằng Asyncio (Non-blocking)
async def fetch_url(session, url):
    async with session.get(url) as response:
        return await response.text()

async def main():
    async with aiohttp.ClientSession() as session:
        html = await fetch_url(session, 'https://api.vinterview.vn')
        print(len(html))

asyncio.run(main())`,
            explanation: `Từ Python 3.12+, cộng đồng Python đang từng bước hỗ trợ thử nghiệm mã nguồn "Free-threaded CPython" (PEP 703) để cho phép gỡ bỏ hoàn toàn GIL trong tương lai.`,
        },
    },
    {
        title: 'Phân biệt thứ tự thực thi và vai trò của Middleware, Guards, Interceptors và Pipes trong NestJS?',
        slug: 'nestjs-middleware-guards-interceptors-pipes-execution-order',
        difficulty: client_1.Difficulty.MEDIUM,
        categorySlug: 'backend-development',
        techSlug: 'nestjs',
        content: `Mô tả chính xác Request Lifecycle trong NestJS framework. Khi một HTTP Request gửi đến, nó đi qua Middleware, Guard, Interceptor, Pipe, Controller và Exception Filter theo thứ tự nào?`,
        answer: {
            content: `Vòng đời của một HTTP Request trong NestJS tuân theo thứ tự nghiêm ngặt:
1. **Incoming Request**
2. **Middleware**: Xử lý thô request (CORS, Request Logging, Body Parser). Tuân theo chuẩn Express Middleware.
3. **Guards**: Kiểm tra Authentication & Authorization (JWT, Role check). Trả về true hoặc false (bắn lỗi 403 Forbidden).
4. **Interceptors (Pre-controller)**: Can thiệp vào luồng xử lý trước khi vào Controller (Bind extra data, caching).
5. **Pipes**: Validate và Transform dữ liệu đầu vào (body, query, param) theo DTO (dùng class-validator).
6. **Controller Handler**: Thự thi logic nghiệp vụ và trả về response.
7. **Interceptors (Post-controller)**: Biến đổi dữ liệu response đầu ra (ví dụ: Format JSON standard response).
8. **Exception Filters**: Bắt và format các ngoại lệ/lỗi bắn ra trong quá trình xử lý.`,
            codeSnippet: `@Controller('users')
@UseGuards(JwtAuthGuard) // 2. Guard
@UseInterceptors(TransformInterceptor) // 3. Interceptor
export class UsersController {
  @Post()
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) { // 4. Pipe
    return this.usersService.create(createUserDto); // 5. Controller Handler
  }
}`,
            explanation: `Phân chia trách nhiệm rõ ràng giúp ứng dụng NestJS cực kỳ dễ bảo trì và mở rộng: Guard chịu trách nhiệm định danh, Pipe chịu trách nhiệm validate dữ liệu, Interceptor chịu trách nhiệm format response và log performance.`,
        },
    },
    {
        title: 'Cách tận dụng tối đa CPU Multi-core trong Node.js bằng Cluster Module và Process Manager (PM2)?',
        slug: 'nodejs-cluster-module-pm2-multi-core-cpu',
        difficulty: client_1.Difficulty.MEDIUM,
        categorySlug: 'backend-development',
        techSlug: 'nodejs',
        content: `Node.js là Single-threaded theo mặc định. Làm thế nào để mở rộng ứng dụng Node.js tận dụng tất cả các nhân CPU trên máy chủ vật lý mà không cần thay đổi kiến trúc?`,
        answer: {
            content: `Node.js chạy trên một Event Loop đơn luồng. Để tận dụng các nhân CPU khác:
- **Node.js Cluster Module**: Cho phép tạo ra một Master process fork nhiều Worker processes chia sẻ chung một cổng mạng (Port). Master process lắng nghe kết nối và phân phối request đến các Worker theo thuật toán Round-Robin.
- **PM2 Cluster Mode**: PM2 là công cụ quản lý process phổ biến nhất cho Node.js sản xuất. Nó tự động quản lý Cluster Mode, tự khôi phục worker bị sập (Zero-downtime reload) và theo dõi tài nguyên bộ nhớ CPU.`,
            codeSnippet: `// Khai báo file ecosystem.config.js cho PM2
module.exports = {
  apps: [{
    name: 'web-interview-api',
    script: './dist/main.js',
    instances: 'max', // Tự động mở worker bằng số lượng nhân CPU
    exec_mode: 'cluster',
    autorestart: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};`,
            explanation: `Việc chạy PM2 Cluster Mode giúp ứng dụng tăng khả năng chịu tải gấp 4-8 lần trên server đa nhân mà không cần dùng đến các giải pháp phức tạp như Kubernetes.`,
        },
    },
    {
        title: 'React Fiber Architecture là gì và cơ chế Concurrent Rendering trong React 18 giải quyết bài toán UI blocking như thế nào?',
        slug: 'react-fiber-architecture-concurrent-rendering-react-18',
        difficulty: client_1.Difficulty.HARD,
        categorySlug: 'frontend-development',
        techSlug: 'react',
        content: `So sánh thuật toán Reconciler cũ (Stack Reconciler) và React Fiber. Các API như useTransition, useDeferredValue giúp tối ưu hóa trải nghiệm người dùng như thế nào khi render danh sách lớn?`,
        answer: {
            content: `**React Fiber** là kiến trúc Reconciler mới được viết lại của React. Ở bản cũ (Stack Reconciler), công việc reconciliation diễn ra đồng bộ và không thể bị ngắt (recursive), gây khựng UI (jank) khi render cây component lớn.

Fiber chia công việc render thành các đơn vị nhỏ (Fiber units of work) có thể tạm dừng, ưu tiên hoặc hủy bỏ (Interruptible Rendering).

**Concurrent Rendering trong React 18**:
- Cho phép React chuẩn bị nhiều phiên bản UI đồng thời ở background mà không làm đóng băng UI thread.
- **useTransition**: Đánh dấu cập nhật state nào có độ ưu tiên thấp (Non-urgent update), giữ cho input/typing mượt mà.
- **useDeferredValue**: Trì hoãn việc render lại một giá trị biến đổi cho tới khi luồng chính rảnh rỗi.`,
            codeSnippet: `import { useState, useTransition } from 'react';

function SearchPage() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [list, setList] = useState([]);

  const handleChange = (e) => {
    setQuery(e.target.value); // Urgent Update (Gõ chữ ngay lập tức)
    startTransition(() => {
      setList(filterHugeList(e.target.value)); // Non-urgent Update (Lọc danh sách 10.000 phần tử)
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <p>Đang tải danh sách...</p>}
      <List items={list} />
    </div>
  );
}`,
            explanation: `React Fiber và Concurrent Mode chuyển đổi trải nghiệm UI từ tĩnh/khựng sang phản hồi tức thì bằng cách phân cấp độ ưu tiên cho từng sự kiện tương tác của người dùng.`,
        },
    },
    {
        title: 'React Server Components (RSC) trong Next.js App Router hoạt động thế nào và khác gì so với SSR truyền thống?',
        slug: 'nextjs-react-server-components-rsc-vs-ssr',
        difficulty: client_1.Difficulty.HARD,
        categorySlug: 'frontend-development',
        techSlug: 'nextjs',
        content: `Phân tích sự khác biệt bản chất giữa React Server Components (RSC) và Server-Side Rendering (SSR). Tại sao RSC lại giúp giảm Bundle Size phía client về 0 KB cho các server-only dependencies?`,
        answer: {
            content: `Phân biệt RSC và SSR:
- **SSR (Server-Side Rendering)**: Render HTML ban đầu trên Server, sau đó gửi toàn bộ JavaScript bundle xuống Client để thực hiện quá trình Hydration. Mọi thư viện sử dụng trong component vẫn được gửi xuống browser.
- **RSC (React Server Components)**: Chạy 100% trên Server và KHÔNG BAO GIỜ gửi mã JavaScript của Server Component xuống Client. Kết quả trả về là một định dạng JSON dạng Virtual DOM Tree (RSC Stream Payload).

**Ưu điểm của RSC**:
- **0 KB Client Bundle Size**: Các thư viện nặng (như marked, moment, prisma) nằm hoàn toàn ở Server.
- Truy cập trực tiếp CSDL và file system từ Component mà không cần tạo REST API endpoint.
- Tự động giữ nguyên trạng thái Client Component khi Server Component re-fetch dữ liệu.`,
            codeSnippet: `// app/dashboard/page.tsx (React Server Component mặc định)
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  // Direct DB Query - Không cần useEffect hay API Route
  const users = await prisma.user.findMany();

  return (
    <div>
      <h1>Danh sách Người dùng ({users.length})</h1>
      {/* Client Component tương tác */}
      <UserTable users={users} />
    </div>
  );
}`,
            explanation: `Kiến trúc lai (Hybrid Architecture) của Next.js App Router kết hợp sức mạnh của Server Components (cho Data Fetching & Security) và Client Components ('use client' cho State & Event Listeners).`,
        },
    },
    {
        title: 'Core Web Vitals (LCP, INP, CLS) là gì và làm thế nào để tối ưu hóa hiệu năng render trang web?',
        slug: 'core-web-vitals-optimization-lcp-inp-cls',
        difficulty: client_1.Difficulty.MEDIUM,
        categorySlug: 'web-architecture-performance',
        techSlug: 'javascript',
        content: `Định nghĩa 3 chỉ số Core Web Vitals của Google: LCP (Largest Contentful Paint), INP (Interaction to Next Paint) và CLS (Cumulative Layout Shift). Trình bày phương pháp kỹ thuật để cải thiện từng chỉ số.`,
        answer: {
            content: `Core Web Vitals ảnh hưởng trực tiếp đến thứ hạng SEO và UX ứng dụng web:
1. **LCP (Largest Contentful Paint)**: Đo thời gian hiển thị phần tử nội dung lớn nhất (ảnh hero, banner, đoạn văn chính). Mục tiêu < 2.5s.
   - *Tối ưu*: Sử dụng CDN, nén ảnh định dạng WebP/AVIF, preload critical assets, dùng Server-Side Rendering (SSR).
2. **INP (Interaction to Next Paint)**: Thay thế FID từ 2024, đo độ trễ phản hồi UI khi người dùng nhấp/gõ phím. Mục tiêu < 200ms.
   - *Tối ưu*: Tách các Long Tasks (> 50ms) bằng requestIdleCallback hoặc setTimeout, dùng React useTransition.
3. **CLS (Cumulative Layout Shift)**: Đo độ dịch chuyển bố cục bất ngờ của trang web. Mục tiêu < 0.1.
   - *Tối ưu*: Luôn quy định kích thước width/height cho <img> và <iframe>, réserve không gian cho quảng cáo/font chữ bằng CSS font-display: swap.`,
            codeSnippet: `<!-- Preload Hero Image để tối ưu LCP -->
<link rel="preload" as="image" href="/hero-banner.webp" type="image/webp">

<!-- Giữ khung layout cố định tránh CLS -->
<div style="aspect-ratio: 16 / 9; background-color: #f0f0f0;">
  <img src="/banner.webp" width="1280" height="720" alt="Banner" />
</div>`,
            explanation: `Tối ưu hóa Core Web Vitals đòi hỏi kết hợp giữa đo đạc bằng Lighthouse / Chrome DevTools Performance tab và tối ưu hóa tài nguyên từ Server đến Client.`,
        },
    },
    {
        title: 'Cấu trúc chỉ mục B-Tree Index và Hash Index trong CSDL quan hệ hoạt động như thế nào và khi nào chỉ mục không được sử dụng?',
        slug: 'database-b-tree-vs-hash-indexing-performance',
        difficulty: client_1.Difficulty.HARD,
        categorySlug: 'database-storage',
        techSlug: 'postgresql',
        content: `Phân tích cấu trúc cây B-Tree Index và Hash Index. Tại sao truy vấn toán tử so sánh khoảng (>, <, BETWEEN, LIKE 'abc%') chỉ dùng được B-Tree? Trường hợp nào Index Scan bị vô hiệu hóa?`,
        answer: {
            content: `So sánh Indexing:
- **B-Tree Index**: Cấu trúc cây tự cân bằng giữ dữ liệu đã được sắp xếp. Hỗ trợ hiệu quả truy vấn so sánh chính xác (=), tìm kiếm khoảng (>, <, BETWEEN) và sắp xếp (ORDER BY). Thời gian tìm kiếm là O(log N).
- **Hash Index**: Dùng bảng băm. Tìm kiếm so sánh chính xác (=) cực nhanh O(1), nhưng KHÔNG hỗ trợ tìm kiếm khoảng hoặc sắp xếp.

**Các trường hợp Index bị vô hiệu hóa (Sequential Scan / Full Table Scan)**:
1. Dùng hàm trên cột indexed: WHERE LOWER(email) = 'user@gmail.com'.
2. Dùng toán tử Wildcard phía trước: WHERE name LIKE '%admin'.
3. Type Coercion (Ép kiểu ngầm định): Cột kiểu String nhưng truyền vào kiểu Number.
4. Bảng có quá ít bản ghi (Query Optimizer nhận thấy Full Scan nhanh hơn Index Scan).`,
            codeSnippet: `-- Sai: Vô hiệu hóa Index trên cột created_at
SELECT * FROM orders WHERE DATE(created_at) = '2026-09-04';

-- Đúng: Tận dụng B-Tree Index tối đa
SELECT * FROM orders 
WHERE created_at >= '2026-09-04 00:00:00' 
  AND created_at < '2026-09-05 00:00:00';`,
            explanation: `Hiểu rõ cơ chế Optimizer của SQL giúp lập trình viên viết được các câu lệnh SQL tối ưu và biết cách tạo Functional Index (Index dựa trên hàm) khi cần thiết.`,
        },
    },
    {
        title: 'SQL Window Functions (ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG) là gì và cách ứng dụng trong truy vấn dữ liệu phức tạp?',
        slug: 'sql-window-functions-row-number-rank-lead-lag',
        difficulty: client_1.Difficulty.MEDIUM,
        categorySlug: 'database-storage',
        techSlug: 'sql',
        content: `Phân biệt Window Functions với hàm nhóm GROUP BY. Viết câu lệnh SQL tìm Top 3 nhân viên có lương cao nhất trong từng phòng ban sử dụng DENSE_RANK().`,
        answer: {
            content: `Khác với GROUP BY (nén nhiều dòng thành 1 dòng kết quả), **Window Functions** tính toán trên một tập hợp các dòng liên quan (Window frame) mà KHÔNG làm mất đi chi tiết từng dòng dữ liệu ban đầu.

Cú pháp chuẩn sử dụng mệnh đề OVER (PARTITION BY ... ORDER BY ...):
- **ROW_NUMBER()**: Đánh số thứ tự duy nhất tăng dần (1, 2, 3, 4).
- **RANK()**: Đánh số thứ tự đồng hạng, có nhảy cách số (1, 2, 2, 4).
- **DENSE_RANK()**: Đánh số thứ tự đồng hạng, KHÔNG nhảy cách số (1, 2, 2, 3).
- **LEAD() / LAG()**: Truy cập dữ liệu của dòng phía sau hoặc phía trước dòng hiện tại.`,
            codeSnippet: `WITH RankedEmployees AS (
  SELECT 
    id, name, department_id, salary,
    DENSE_RANK() OVER (
      PARTITION BY department_id 
      ORDER BY salary DESC
    ) as rank_num
  FROM employees
)
SELECT * FROM RankedEmployees WHERE rank_num <= 3;`,
            explanation: `Window Functions là công cụ đắc lực trong phân tích dữ liệu (Business Intelligence / Data Engineering) giúp giải quyết các bài toán xếp hạng, tính doanh thu lũy kế và so sánh tăng trưởng theo thời gian.`,
        },
    },
    {
        title: 'Cơ chế lưu trữ dữ liệu bền vững (Persistence) trong Redis: So sánh RDB Snapshots và Append Only File (AOF)?',
        slug: 'redis-persistence-rdb-vs-aof-snapshots',
        difficulty: client_1.Difficulty.MEDIUM,
        categorySlug: 'database-storage',
        techSlug: 'redis',
        content: `Redis lưu trữ toàn bộ dữ liệu trên RAM. Làm sao để khôi phục dữ liệu khi server bị khởi động lại? Phân tích ưu nhược điểm của 2 cơ chế RDB (Redis Database) và AOF (Append Only File).`,
        answer: {
            content: `Hai cơ chế Persistence trong Redis:
- **RDB (Snapshotting)**: Chụp lại toàn bộ trạng thái dữ liệu trên RAM thành file nhị phân nén (dạng dump.rdb) theo các khoảng thời gian định trước (vd: 5 phút/lần).
  - *Ưu điểm*: File gọn nhẹ, khôi phục server cực nhanh.
  - *Nhược điểm*: Nguy cơ mất dữ liệu trong khoảng thời gian giữa 2 lần snapshot.
- **AOF (Append Only File)**: Ghi lại mọi lệnh ghi (SET, DEL, INCR) xuống file log theo thời gian thực (hoặc mỗi giây).
  - *Ưu điểm*: An toàn dữ liệu tối đa (mất tối đa 1 giây dữ liệu).
  - *Nhược điểm*: File AOF lớn dần theo thời gian (cần cơ chế AOF Rewrite để nén bớt).`,
            codeSnippet: `# Cấu hình kết hợp RDB & AOF trong redis.conf
appendonly yes
appendfsync everysec

# Tự động trigger RDB Snapshot nếu có 10.000 thay đổi trong 60 giây
save 60 10000`,
            explanation: `Best practice cho môi trường Production: Kết hợp cả RDB và AOF (Hybrid Persistence) để vừa đảm bảo khả năng khôi phục nhanh vừa an toàn dữ liệu tuyệt đối.`,
        },
    },
    {
        title: 'Kiến trúc cơ bản của cụm Kubernetes (Control Plane vs Worker Nodes): Pod, Deployment và Service là gì?',
        slug: 'kubernetes-architecture-control-plane-worker-nodes-pod-service',
        difficulty: client_1.Difficulty.HARD,
        categorySlug: 'devops-infrastructure',
        techSlug: 'docker',
        content: `Giải thích kiến trúc cụm Kubernetes (K8s): Vai trò của API Server, etcd, Scheduler trong Control Plane và Kubelet trên Worker Node. Phân biệt các khái niệm Pod, ReplicaSet, Deployment và Service (ClusterIP, NodePort, LoadBalancer).`,
        answer: {
            content: `Kiến trúc Kubernetes (K8s):
1. **Control Plane (Master Node)**:
   - **kube-apiserver**: Đầu mối giao tiếp duy nhất của cụm.
   - **etcd**: CSDL Key-Value phân tán lưu trữ toàn bộ trạng thái cụm K8s.
   - **kube-scheduler**: Lựa chọn Worker Node tối ưu để đặt Pod.
   - **kube-controller-manager**: Đảm bảo trạng thái thực tế của cụm trùng khớp với trạng thái khai báo (Desired State).
2. **Worker Node**:
   - **kubelet**: Agent giao tiếp với Control Plane và Docker Engine trên node.
   - **kube-proxy**: Quản lý quy tắc mạng (iptables) định tuyến traffic.

3. **K8s Objects**:
   - **Pod**: Đơn vị nhỏ nhất chứa 1 hoặc nhiều Docker containers.
   - **Deployment**: Quản lý việc cập nhật (Rolling Update), tự động khôi phục Pod bị sập.
   - **Service**: Tạo điểm truy cập cố định (Static IP/DNS) cho tập hợp các Pods.`,
            codeSnippet: `# Khai báo Deployment cho Web API
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vinterview-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: vinterview/api:v1.0.0
        ports:
        - containerPort: 4000`,
            explanation: `Kubernetes đã trở thành tiêu chuẩn thực tế (de-facto standard) trong việc điều phối container (container orchestration) cho các hệ thống ứng dụng quy mô lớn.`,
        },
    },
    {
        title: 'So sánh Authentication dựa trên Session-Cookie và JWT Token. Làm sao để giải quyết bài toán Token Invalidation / Revocation với JWT?',
        slug: 'jwt-vs-session-cookie-authentication-token-revocation',
        difficulty: client_1.Difficulty.MEDIUM,
        categorySlug: 'cybersecurity-information-security',
        techSlug: 'rest-api',
        content: `So sánh hai cơ chế xác thực Session-based và Token-based (JWT). Vì sao JWT có tính Stateless nhưng lại khó thu hồi (revoke/logout) trước khi hết hạn? Trình bày 3 giải pháp xử lý.`,
        answer: {
            content: `So sánh:
- **Session-Cookie**: Stateful. Server lưu session dữ liệu trên bộ nhớ/Redis, client giữ Session ID trong Cookie. Dễ thu hồi (chỉ cần xóa session trên server) nhưng khó mở rộng trên cụm server lớn.
- **JWT (JSON Web Token)**: Stateless. Token chứa thông tin User và được ký điện tử (HMAC/RSA). Server không cần lưu state, tự giải mã và tin tưởng token. Khó thu hồi tức thì trước khi hết hạn (exp).

**Giải pháp thu hồi JWT Token (Token Revocation)**:
1. **Short-lived Access Token + Long-lived Refresh Token**: Đặt thời hạn Access Token ngắn (5-15 phút). Kiểm tra tính hợp lệ của Refresh Token tại Redis khi cấp mới.
2. **JWT Blacklist trong Redis**: Khi người dùng Logout, lưu JWT ID (jti) vào Redis với thời hạn TTL đúng bằng thời gian sống còn lại của token.
3. **Token Versioning / User Password Version**: Thêm cột tokenVersion vào User table. Khi đổi mật khẩu/logout all devices, tăng tokenVersion++.`,
            codeSnippet: `// Kiểm tra JWT Blacklist tại NestJS JwtAuthGuard
async canActivate(context: ExecutionContext): Promise<boolean> {
  const request = context.switchToHttp().getRequest();
  const token = this.extractTokenFromHeader(request);
  
  const isBlacklisted = await this.redis.get(\`blacklist:\${token}\`);
  if (isBlacklisted) {
    throw new UnauthorizedException('Token đã bị thu hồi');
  }
  
  return true;
}`,
            explanation: `Kết hợp Short-lived Access Token và Redis Blacklist cho Refresh Token là kiến trúc bảo mật tiêu chuẩn được áp dụng rộng rãi trên các ứng dụng ngân hàng và thương mại điện tử.`,
        },
    },
    {
        title: 'Kiến trúc của Apache Kafka (Producers, Consumers, Topics, Partitions, Consumer Groups) và cơ chế Exactly-Once Processing?',
        slug: 'apache-kafka-architecture-producers-consumers-partitions',
        difficulty: client_1.Difficulty.HARD,
        categorySlug: 'data-engineering-big-data',
        techSlug: 'kafka',
        content: `Giải thích kiến trúc phân tán của Apache Kafka. Tại sao việc chia Topic thành các Partitions lại giúp Kafka đạt thông lượng (throughput) hàng triệu message mỗi giây?`,
        answer: {
            content: `Apache Kafka là nền tảng Distributed Event Streaming hiệu năng cao:
- **Topic & Partitions**: Mỗi Topic được chia nhỏ thành nhiều **Partitions** nằm rải rác trên các Kafka Brokers. Partition là một file log append-only sắp thứ tự.
- **Scalability**: Việc phân chia Partitions cho phép ghi và đọc dữ liệu song song (Parallel Processing).
- **Consumer Groups**: Tập hợp các Consumers chia nhau xử lý message từ các Partitions. Mỗi Partition chỉ được đọc bởi 1 Consumer duy nhất trong cùng 1 Group tại một thời điểm.
- **Exactly-Once Semantics (EOS)**: Đảm bảo message không bị mất cũng như không bị xử lý lặp lại nhờ kết hợp Producer Idempotence và Transactional Coordinator.`,
            codeSnippet: `// Ví dụ Node.js Kafka Producer sử dụng kafkajs
const { Kafka } = require('kafkajs');

const kafka = new Kafka({ clientId: 'vinterview-app', brokers: ['kafka:9092'] });
const producer = kafka.producer();

async function sendOrderEvent(order) {
  await producer.connect();
  await producer.send({
    topic: 'order-created-topic',
    messages: [
      { key: order.userId, value: JSON.stringify(order) } // Key đảm bảo cùng user luôn vào 1 partition
    ],
  });
}`,
            explanation: `Kafka đóng vai trò là xương sống cho các hệ thống Data Pipeline, Real-time Analytics và Event-Driven Microservices hiện đại.`,
        },
    },
    {
        title: 'Kiến trúc Retrieval-Augmented Generation (RAG) hoạt động như thế nào để kết hợp LLMs với cơ sở dữ liệu tri thức doanh nghiệp?',
        slug: 'retrieval-augmented-generation-rag-architecture-llm',
        difficulty: client_1.Difficulty.HARD,
        categorySlug: 'artificial-intelligence-machine-learning',
        techSlug: 'python',
        content: `Phân tích mô hình RAG (Retrieval-Augmented Generation) trong ứng dụng AI. Làm thế nào Vector Database (pgvector, Pinecone, Qdrant) và Embeddings giúp giải quyết bài toán Hallucination của LLMs?`,
        answer: {
            content: `RAG (Retrieval-Augmented Generation) là kỹ thuật cung cấp thông tin tri thức bên ngoài vào ngữ cảnh (Context Window) của Large Language Model (LLM) trước khi tạo câu trả lời:

**Các bước trong quy trình RAG**:
1. **Document Ingestion & Chunking**: Chia nhỏ tài nguyên doanh nghiệp (PDF, Docs) thành các văn bản ngắn.
2. **Embedding Generation**: Dùng Embedding Model (như OpenAI text-embedding-3-small) biến đổi văn bản thành các Vector nhiều chiều.
3. **Vector Storage**: Lưu trữ Vector vào CSDL Vector (như PostgreSQL với extension pgvector).
4. **Retrieval**: Khi user đặt câu hỏi, chuyển câu hỏi thành Vector và tìm kiếm các đoạn văn bản có độ tương đồng Semantic cao nhất (Cosine Similarity / Euclidean Distance).
5. **Generation**: Đưa thông tin trích xuất vào Prompt gửi cho LLM để tạo câu trả lời chính xác, tránh hiện tượng LLM chém gió (Hallucination).`,
            codeSnippet: `# Tìm kiếm vector tương đồng bằng pgvector trong PostgreSQL
SELECT content, 1 - (embedding <=> $1) AS similarity
FROM document_chunks
WHERE 1 - (embedding <=> $1) > 0.8
ORDER BY similarity DESC
LIMIT 5;`,
            explanation: `RAG là giải pháp chi phí thấp và hiệu quả cao hơn nhiều so với việc Fine-tuning lại toàn bộ mô hình LLM khi cần cập nhật dữ liệu tri thức mới cho doanh nghiệp.`,
        },
    },
    {
        title: 'Tháp kiểm thử (Testing Pyramid): Phân biệt Unit Test, Integration Test và End-to-End (E2E) Test trong phát triển phần mềm?',
        slug: 'testing-pyramid-unit-vs-integration-vs-e2e-testing',
        difficulty: client_1.Difficulty.EASY,
        categorySlug: 'software-testing-quality-assurance',
        techSlug: 'typescript',
        content: `Trình bày mô hình Testing Pyramid. Tại sao nên dành số lượng lớn nhất cho Unit Test và ít nhất cho E2E Test? Cho ví dụ công cụ tương ứng (Jest, Vitest, Playwright, Cypress).`,
        answer: {
            content: `Tháp kiểm thử (Testing Pyramid) quy định tỷ lệ phân bổ các loại test:
1. **Unit Test (Đáy tháp - Chiếm 70%)**: Kiểm thử các hàm, class đơn lẻ trong môi trường cách ly (dùng Mocks/Stubs).
   - *Đặc điểm*: Tốc độ chạy cực nhanh (vài miligiây), chi phí bảo trì thấp. Công cụ: Jest, Vitest, JUnit.
2. **Integration Test (Giữa tháp - Chiếm 20%)**: Kiểm thử sự tương tác giữa nhiều module với nhau (vd: NestJS Controller tương tác với PostgreSQL CSDL thực tế).
   - *Đặc điểm*: Chậm hơn Unit test, đảm bảo các component kết nối đúng đắn.
3. **End-to-End Test (Đỉnh tháp - Chiếm 10%)**: Kiểm thử toàn bộ luồng trải nghiệm người dùng trên trình duyệt thực tế từ Frontend down xuống Backend CSDL.
   - *Đặc điểm*: Tốn thời gian chạy nhất, dễ bị lỗi chập chờn (flaky), chi phí viết và bảo trì cao. Công cụ: Playwright, Cypress.`,
            codeSnippet: `// Ví dụ Unit Test bằng Vitest
import { describe, it, expect } from 'vitest';
import { calculateDiscount } from './discount';

describe('calculateDiscount', () => {
  it('nên giảm 20% cho tài khoản Premium', () => {
    const result = calculateDiscount(100, true);
    expect(result).toBe(80);
  });
});`,
            explanation: `Tuân thủ mô hình Testing Pyramid giúp đội ngũ phát triển phát hiện lỗi sớm ngay ở tầng Unit Test, đảm bảo tốc độ phản hồi CI/CD nhanh chóng mà vẫn đạt độ tin cậy cao.`,
        },
    },
];
async function seedQuestions(prisma, categoryMap, techMap) {
    let questionCount = 0;
    for (const q of exports.questionsData) {
        const categoryId = categoryMap.get(q.categorySlug);
        const technologyId = techMap.get(q.techSlug);
        if (!categoryId || !technologyId) {
            console.warn(`⚠️ Warning: Missing relation for ${q.slug}`);
            continue;
        }
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
}
//# sourceMappingURL=questions.seed.js.map