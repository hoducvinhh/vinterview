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