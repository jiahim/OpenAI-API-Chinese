# 目录

- [介绍](#介绍)
- [快速开始](#快速开始)
- [最佳实践](#最佳实践)
- [插入代码 ( 测试版 )](#插入代码--测试版-)
- [编辑代码 ( 测试版 )](#编辑代码--测试版-)

# **代码补全** (有限测试版)

学习如何生成或操作代码

## **<a id="Introduce">介绍</a>**

[Codex 系列模型](https://platform.openai.com/docs/models/codex)是基于我们的[GPT-3 系列模型](https://platform.openai.com/docs/models/base-series)，并且已经同时经过自然语言和百万行代码的训练。它最擅长 Python 并且熟练十几种语言包括 Javascript、Go、Perl、PHP、Ruby、Swift、TypeScript、SQL 甚至是 Shell。在最初有限测试的期间，Codex 的可以免费使用。[了解更多](https://platform.openai.com/docs/models/codex)

你可以使用 Codex 来完成多种任务，包括：

- 将注释转换成代码
- 基于上下文完成你的下一行或者 function
- 增长你的知识面，比如为应用找到合适的库或者 API 调用
- 添加注释
- 重构代码以提高效率

想看看 Codex 的实际操作，可以查看我们的[Codex Javascript 沙盒](https://platform.openai.com/codex-javascript-sandbox)或者我们其他的[示例视频](https://www.youtube.com/playlist?list=PLOXw6I10VTv_FhQbbvYh1FvbiaPf43Ve2)。

![](./image/sandbox-screenshot.png)

## **<a id="Quickstart">快速开始</a>**

开始自己使用 Codex，在[在线编辑器](https://platform.openai.com/playground)中打开这个示例。

### **说“Hello”（Python）**

```Python
"""
询问用户的名字并说Hello
"""
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%22%22%22%0AAsk%20the%20user%20for%20their%20name%20and%20say%20%22Hello%22%0A%22%22%22)

### **创建一个随机的名字（Python）**

```Python
"""
1. 创建一个名字的列表
2. 创建一个姓的列表
3. 将他们随机组合成有100个完整名字的列表
"""
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%22%22%22%0A1.%20Create%20a%20list%20of%20first%20names%0A2.%20Create%20a%20list%20of%20last%20names%0A3.%20Combine%20them%20randomly%20into%20a%20list%20of%20100%20full%20names%0A%22%22%22)

### **创建一个 MySql 的查询语句（Python）**

```Python
"""
表格名为customers，列 = [CustomerId, FirstName, LastName, Company, Address, City, State, Country, PostalCode, Phone, Fax, Email, SupportRepId]
为所有在得克萨斯州名为Jane的顾客创建一个SQL查询
"""
query =
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%22%22%22%0ATable%20customers%2C%20columns%20%3D%20%5BCustomerId%2C%20FirstName%2C%20LastName%2C%20Company%2C%20Address%2C%20City%2C%20State%2C%20Country%2C%20PostalCode%2C%20Phone%2C%20Fax%2C%20Email%2C%20SupportRepId%5D%0ACreate%20a%20MySQL%20query%20for%20all%20customers%20in%20Texas%20named%20Jane%0A%22%22%22%0Aquery%20%3D)

### **解释代码（JavaScript）**

```javascript
// Function 1
var fullNames = [];
for (var i = 0; i < 50; i++) {
  fullNames.push(
    names[Math.floor(Math.random() * names.length)] +
      " " +
      lastNames[Math.floor(Math.random() * lastNames.length)]
  );
}

// Function 1 做了什么？
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%2F%2F%20Function%201%0Avar%20fullNames%20%3D%20%5B%5D%3B%0Afor%20%28var%20i%20%3D%200%3B%20i%20%3C%2050%3B%20i%2B%2B%29%20%7B%0A%20%20fullNames.push%28names%5BMath.floor%28Math.random%28%29%20%2A%20names.length%29%5D%0A%20%20%20%20%2B%20%22%20%22%20%2B%20lastNames%5BMath.floor%28Math.random%28%29%20%2A%20lastNames.length%29%5D%29%3B%0A%7D%0A%0A%2F%2F%20What%20does%20Function%201%20do%3F)

### **更多示例**

访问我们的[示例库](https://platform.openai.com/examples?category=code)，探索更多为 Codex 设计的功能。

## **<a id="BestPractices">最佳实践</a>**

从一句注释、数据或代码开始。你可以在我们的在线编辑器中尝试使用任一 Codex 模型（在需要的时候将指令作为注释）。

为了让 Codex 更好地进行补全，我们需要思考程序员在完成任务时需要哪些信息。这可能只是一个清晰的注释或者写一个有用的 function 所需要的数据，如变量名名或者是处理 function 的类。

```python
 # 创建一个名为‘nameImporter’的function，来将姓和名存入到数据库中
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%23%20Create%20a%20function%20called%20%27nameImporter%27%20to%20add%20a%20first%20and%20last%20name%20to%20the%20database)

在这个例子中，我们告诉 Codex 要调用的 function 以及他将要执行的任务。

这种方式你甚至可以给 Codex 提供注释和数据库的样例 schema，让它为各种数据库写一些有用的查询请求。

```python
 # Table albums, columns = [AlbumId, Title, ArtistId]
 # Table artists, columns = [ArtistId, Name]
 # Table media_types, columns = [MediaTypeId, Name]
 # Table playlists, columns = [PlaylistId, Name]
 # Table playlist_track, columns = [PlaylistId, TrackId]
 # Table tracks, columns = [TrackId, Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice]

 为所有阿黛尔的专辑创建一个查询
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%23%20Table%20albums%2C%20columns%20%3D%20%5BAlbumId%2C%20Title%2C%20ArtistId%5D%0A%23%20Table%20artists%2C%20columns%20%3D%20%5BArtistId%2C%20Name%5D%0A%23%20Table%20media_types%2C%20columns%20%3D%20%5BMediaTypeId%2C%20Name%5D%0A%23%20Table%20playlists%2C%20columns%20%3D%20%5BPlaylistId%2C%20Name%5D%0A%23%20Table%20playlist_track%2C%20columns%20%3D%20%5BPlaylistId%2C%20TrackId%5D%0A%23%20Table%20tracks%2C%20columns%20%3D%20%5BTrackId%2C%20Name%2C%20AlbumId%2C%20MediaTypeId%2C%20GenreId%2C%20Composer%2C%20Milliseconds%2C%20Bytes%2C%20UnitPrice%5D%0A%0A%23%20Create%20a%20query%20for%20all%20albums%20by%20Adele)

当你向 Codex 展示一个数据库的 schema 时，它可以有依据地猜测出如何去格式化查询。

**指明语言**。Codex 掌握十几种编程语言，许多语言在注释、函数或编程语法有类似的约定。通过在注释中指明语言和版本，Codex 可以更好的为你提供想要的代码补全能力，Codex 在风格和语法上相当灵活。

```python
 # R语言
 # 计算点数组之间的平均距离
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%23%20R%20language%0A%23%20Calculate%20the%20mean%20distance%20between%20an%20array%20of%20points)

```python
 # Python
 # 计算点数组之间的平均距离
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%23%20Python%203%0A%23%20Calculate%20the%20mean%20distance%20between%20an%20array%20of%20points)

**_提示 Codex 你想要它做什么_**。如果你想 Codex 创建一个网页，在你告诉它要做什么的注释之后，放一个在 Html 文档（`<!DOCTYPE html>`）的第一行代码。

```html
<!-- 创建一个网页，title为'Kat Katman attorney at paw' -->
<!DOCTYPE html>
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%3C%21--%20Create%20a%20web%20page%20with%20the%20title%20%27Kat%20Katman%20attorney%20at%20paw%27%20--%3E%0A%3C%21DOCTYPE%20html%3E)

在我们的注释之后放一个`<!DOCTYPE html>`，可以让 Codex 明确知道我们想要它做什么。

```python
 创建一个数到100的函数

def counter
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%23%20Create%20a%20function%20to%20count%20to%20100%0A%0Adef%20counter)

如果我们开始写函数，Codex 将会明白接下来它将需要干什么。

**指明函数库可以让 Codex 明白你想要什么**。Codex 知道大量的库、API 或者 model。通过告诉 Codex 使用哪一个，不论是用注释或者直接在代码中导入的方式，Codex 将会在此基础上提出建议而不是替代方案。

```html
<!-- 使用版本为1.2.0的A-Frame库，创建一个3D到网站 -->
<!-- https://aframe.io/releases/1.2.0/aframe.min.js -->
```

通过指明版本，你可以确保 Codex 使用最新的库。

提示：Codex 可以建议有用的库或则 API，但你需要自己再去调研下以确保它们对你应用来说是安全的。

**注释风格会影响代码质量**。在某些语言中，注释的风格可以提升输出的质量。例如，当使用 Python 时，在某些情况下，使用 doc 字符串注释（用三引号括起来）可以比通过使用井号(#)注释提供更高质量的结果。

```python
"""
创建一个用户和邮箱地址的数组
"""
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%22%22%22%0ACreate%20an%20array%20of%20users%20and%20email%20addresses%0A%22%22%22)

**在函数中添加注释会很有帮助**。推荐的编码标准通常建议将函数的注释放在其内部。使用这种格式可以让 Codex 更清楚地知道你想要这个函数做什么。

```python
def getUserBalance(id):
    """
    Look up the user in the database ‘UserData' and return their current account balance.
    """
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=def%20getUserBalance%28id%29%3A%0A%20%20%20%20%22%22%22%0A%20%20%20%20Look%20up%20the%20user%20in%20the%20database%20‘UserData%27%20and%20return%20their%20current%20account%20balance.%0A%20%20%20%20%22%22%22)

**提供示例来获取更精准的结果**。如果你需要 Codex 去使用特别的风格或者格式，在第一部份提供例子或者示范它能让 Codex 更精准地了解你想要的。

```python
"""
创建一个随机动物和物种的列表
"""
animals  = [ {"name": "Chomper", "species": "Hamster"}, {"name":
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%22%22%22%0ACreate%20a%20list%20of%20random%20animals%20and%20species%0A%22%22%22%0Aanimals%20%20%3D%20%5B%20%7B%22name%22%3A%20%22Chomper%22%2C%20%22species%22%3A%20%22Hamster%22%7D%2C%20%7B%22name%22%3A)

**更低的 `temperatures` 给出更准确的结果**。在大多数情况下，设置 API 的 `temperatures` 为 0， 或者接近零（比如 0.1 或 0.2）将得出一个更好的结果。不像 GPT-3， 更高的 `temperatures` 可以提供有用的创造性和随机的结果， Codex 更高的 `temperatures` 会给你一个真随机和不稳定的响应。如果你真的需要 Codex 提供不同可能性的结果，可以从零开始，并且每次增加 0.1 直到你找到合适的结果值。

**将任务组织成函数**。我们可以在注释中，用尽可能清晰的术语描述需要的函数，并让 Codex 去实现它。通过下面的注释，Codex 创建了一个用户点击按钮触发的 Javascript 计时器函数：
一个简单的 Javascript 计时器

```javascript
// 创建一个计时器，在 10 秒内创建告警
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%2F%2F%20Create%20a%20timer%20that%20creates%20an%20alert%20in%2010%20seconds)

我们可以使用 Codex 与知名的库一起执行常见任务，例如使用 Stripe API 创建客户:

用 Python 创建一个 Stripe 客户：

```python
# 从邮箱地址创建一个 Stripe 客户
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%23%20Create%20a%20Stripe%20customer%20from%20an%20email%20address)

**创建示例数据**。测试应用通常需要使用示例数据。因为 Codgen 是一个直到如何理解和编写自然语言的语言模型，所以您可以让 Codex 创建数据，例如由名称、产品和其他变量组成的数组。

```javascript
/* 创建一个旧金山的天气数组 */
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%2F%2A%20Create%20an%20array%20of%20weather%20temperatures%20for%20San%20Francisco%20%2A%2F)

让 Codex 执行这个任务会生成一个像这样的表格：

```javascript
var weather = [
  { month: "January", high: 58, low: 48 },
  { month: "February", high: 61, low: 50 },
  { month: "March", high: 64, low: 53 },
  { month: "April", high: 67, low: 55 },
  { month: "May", high: 70, low: 58 },
  { month: "June", high: 73, low: 61 },
  { month: "July", high: 76, low: 63 },
  { month: "August", high: 77, low: 64 },
  { month: "September", high: 76, low: 63 },
  { month: "October", high: 73, low: 61 },
  { month: "November", high: 68, low: 57 },
  { month: "December", high: 64, low: 54 },
];
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=var%20weather%20%3D%20%5B%0A%20%20%7B%20month%3A%20%27January%27%2C%20high%3A%2058%2C%20low%3A%2048%20%7D%2C%0A%20%20%7B%20month%3A%20%27February%27%2C%20high%3A%2061%2C%20low%3A%2050%20%7D%2C%0A%20%20%7B%20month%3A%20%27March%27%2C%20high%3A%2064%2C%20low%3A%2053%20%7D%2C%0A%20%20%7B%20month%3A%20%27April%27%2C%20high%3A%2067%2C%20low%3A%2055%20%7D%2C%0A%20%20%7B%20month%3A%20%27May%27%2C%20high%3A%2070%2C%20low%3A%2058%20%7D%2C%0A%20%20%7B%20month%3A%20%27June%27%2C%20high%3A%2073%2C%20low%3A%2061%20%7D%2C%0A%20%20%7B%20month%3A%20%27July%27%2C%20high%3A%2076%2C%20low%3A%2063%20%7D%2C%0A%20%20%7B%20month%3A%20%27August%27%2C%20high%3A%2077%2C%20low%3A%2064%20%7D%2C%0A%20%20%7B%20month%3A%20%27September%27%2C%20high%3A%2076%2C%20low%3A%2063%20%7D%2C%0A%20%20%7B%20month%3A%20%27October%27%2C%20high%3A%2073%2C%20low%3A%2061%20%7D%2C%0A%20%20%7B%20month%3A%20%27November%27%2C%20high%3A%2068%2C%20low%3A%2057%20%7D%2C%0A%20%20%7B%20month%3A%20%27December%27%2C%20high%3A%2064%2C%20low%3A%2054%20%7D%0A%5D%3B)

**将函数组合成小应用**。我们可以给 Codex 提供一些复杂请求的注释，像创建一个随机名字生成器或，或者是执行带有用户输入的任务，如果有足够的 token ， Codex 可以生成余下的内容。

```javascript
/*
创建一个动物的列表
创建一个城市的列表
使用上面的列表，生成一个故事关于我在每个城市的动物园的所见所闻
*/
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%2F%2A%0ACreate%20a%20list%20of%20animals%0ACreate%20a%20list%20of%20cities%0AUse%20the%20lists%20to%20generate%20stories%20about%20what%20I%20saw%20at%20the%20zoo%20in%20each%20city%0A%2A%2F)

**限制补全的大小来获取更精准的结果或是更快的响应**。在 Codex 中请求过长的补全可能会导致不清晰的答案或过于啰嗦。通过降低 `max_tokens` 和在 `stop` 中设置 token 来限制查询参数的大小。比如说，把 `\n` 添加到 `stop` 中来限制补全只有一行代码。更小的补全能有更快的响应。

**使用 流 ( streaming ) 来减少响应时间**。过大的 Codex 请求会耗费十几秒来完成补全。如果开发的应用有低延迟的要求，比如像要自动完成补全的代码助手，就可以考虑使用流。请求会在模型生成完整的补全之前开始返回。如果应用只需要部分的补全，可以通过程序的方式或者是使用 `stop` 中的字符串的方式进行中止。

用户可以通过从 API 请求多次结果并使用返回的第一个响应，将流式处理与复制结合起来以减少延迟。通过设置 `n > 1` 实现。这个方法会消耗更多的 token， 所以用的时候要小心 ( 比如，合理地使用设置项 `max_tokens` 和 `stop` )。

**让 Codex 解释代码行为**。 Codex 创建和理解代码的能力让我们可以用它去完成一些像解释文件中代码行为的任务。一种实现这个目的方法是，把带有“这个方法”或“这个应用是”开头的注释放到函数的末尾。 Codex 会把注释作为解释的开头并完成剩余的部分。

```javascript
/* 解释前面的函数做了什么： 它  */
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%2F%2A%20Explain%20what%20the%20previous%20function%20is%20doing%3A%20It)

**解释一个 SQL 查询**。在这个例子中，我们让 Codex 用成人类可以理解的语言，解释 SQL 查询语句做的是什么。

```SQL
SELECT DISTINCT department.name
FROM department
JOIN employee ON department.id = employee.department_id
JOIN salary_payments ON employee.id = salary_payments.employee_id
WHERE salary_payments.date BETWEEN '2020-06-01' AND '2020-06-30'
GROUP BY department.name
HAVING COUNT(employee.id) > 10;
-- 用人类可以理解的语言，解释上面的查询语句
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=SELECT%20DISTINCT%20department.name%0AFROM%20department%0AJOIN%20employee%20ON%20department.id%20%3D%20employee.department_id%0AJOIN%20salary_payments%20ON%20employee.id%20%3D%20salary_payments.employee_id%0AWHERE%20salary_payments.date%20BETWEEN%20%272020-06-01%27%20AND%20%272020-06-30%27%0AGROUP%20BY%20department.name%0AHAVING%20COUNT%28employee.id%29%20%3E%2010%3B%0A--%20Explanation%20of%20the%20above%20query%20in%20human%20readable%20format%0A--)

**编写单元测试**。通过简单地添加 “Unit test” (译者注:即单元测试) 并写上一个函数的开头，就可以简单地用 Python 创建一个单元测试。

```python
# Python 3
def sum_numbers(a, b):
  return a + b

# Unit test
def
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%23%20Python%203%0Adef%20sum_numbers%28a%2C%20b%29%3A%0A%20%20return%20a%20%2B%20b%0A%0A%23%20Unit%20test%0Adef)

**检查代码错误**。通过示例，你可以知道怎么让 Codex 去找到代码中的错误。有些情况下不需要示例，但是展示描述的级别和细节，可以帮助 Codex 了解要寻找什么以及如何解释它。( Codex 的错误检查不能代替用户的仔细评审。)

```javascript
/* 解释前面的代码为什么不执行 */
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%2F%2A%20Explain%20why%20the%20previous%20function%20doesn%27t%20work.%20%2A%2F)

**使用源数据编写数据库函数**。就像人类程序员能理解数据库结构和列名中，并进行工作一样， Codex 可以使用这些数据来帮你写一个精确的查询请求。在这个例子中，我们为一个数据插入了一个 schema 并且告诉 Codex 要查询数据库的什么。

```Python
# Table albums, columns = [AlbumId, Title, ArtistId]
# Table artists, columns = [ArtistId, Name]
# Table media_types, columns = [MediaTypeId, Name]
# Table playlists, columns = [PlaylistId, Name]
# Table playlist_track, columns = [PlaylistId, TrackId]
# Table tracks, columns = [TrackId, Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice]

# 创建一个查询阿黛尔全部专辑的语句
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%23%20Table%20albums%2C%20columns%20%3D%20%5BAlbumId%2C%20Title%2C%20ArtistId%5D%0A%23%20Table%20artists%2C%20columns%20%3D%20%5BArtistId%2C%20Name%5D%0A%23%20Table%20media_types%2C%20columns%20%3D%20%5BMediaTypeId%2C%20Name%5D%0A%23%20Table%20playlists%2C%20columns%20%3D%20%5BPlaylistId%2C%20Name%5D%0A%23%20Table%20playlist_track%2C%20columns%20%3D%20%5BPlaylistId%2C%20TrackId%5D%0A%23%20Table%20tracks%2C%20columns%20%3D%20%5BTrackId%2C%20Name%2C%20AlbumId%2C%20MediaTypeId%2C%20GenreId%2C%20Composer%2C%20Milliseconds%2C%20Bytes%2C%20UnitPrice%5D%0A%0A%23%20Create%20a%20query%20for%20all%20albums%20by%20Adele)

**在两种编程语言间做转换**。通过和下面一样类似的格式，在注释中列出你想要转换的语言，然后接上代码以及你想要转换的的语言，就可以让 Codex 将一种编程语言转换成另一种。

```Python
# 将这个从 Python 转换成 R语言
# Python版本

[ Python 代码写在这里 ]

# 结束

# R语言版本的代码
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%23%20Convert%20this%20from%20Python%20to%20R%0A%23%20Python%20version%0A%0A%5B%20Python%20code%20%5D%0A%0A%23%20End%0A%0A%23%20R%20version)

**为一个库或者框架重写代码**。如果想要通过 Codex 让一个函数更高效，你可以在一条你的重写要求的注释后面，接上需要重写的代码。

```javascript
// 把下面重写成一个 React component
var input = document.createElement("input");
input.setAttribute("type", "text");
document.body.appendChild(input);
var button = document.createElement("button");
button.innerHTML = "Say Hello";
document.body.appendChild(button);
button.onclick = function () {
  var name = input.value;
  var hello = document.createElement("div");
  hello.innerHTML = "Hello " + name;
  document.body.appendChild(hello);
};

// React版本的代码
```

[在线编辑器中打开](https://platform.openai.com/playground?model=code-davinci-002&prompt=%2F%2F%20Rewrite%20this%20as%20a%20React%20component%0Avar%20input%20%3D%20document.createElement%28%27input%27%29%3B%0Ainput.setAttribute%28%27type%27%2C%20%27text%27%29%3B%0Adocument.body.appendChild%28input%29%3B%0Avar%20button%20%3D%20document.createElement%28%27button%27%29%3B%0Abutton.innerHTML%20%3D%20%27Say%20Hello%27%3B%0Adocument.body.appendChild%28button%29%3B%0Abutton.onclick%20%3D%20function%28%29%20%7B%0A%20%20var%20name%20%3D%20input.value%3B%0A%20%20var%20hello%20%3D%20document.createElement%28%27div%27%29%3B%0A%20%20hello.innerHTML%20%3D%20%27Hello%20%27%20%2B%20name%3B%0A%20%20document.body.appendChild%28hello%29%3B%0A%7D%3B%0A%0A%2F%2F%20React%20version%3A)

## **<a id="InsertingCode">插入代码 ( 测试版 )</a>**

补全接口还支持将 `prompt` 作为前缀提示文本和 `suffix` 作为后缀提示文本，来支持代码插入。这可以用来在一个函数或者文件的中间插入补全。(**译者注**：以需要补全的代码作为分割，接口入参中的 `prompt` 传入需要补全的代码的前半段, `suffix` 作为需要补全的代码的后半段，加上将 model 设置为 `code-davinci-002` ，即可获取到需要补全的代码)

```Python
# 译者注：注释的部分就是要补全的代码
def get_largest_prime_factor(n):
    if n < 2:
        return False
    def i#s_prime(n): >  for i in range(2, n): >  if n % i == 0: >  return False >  return True >     largest = 1
    for j in range(2, n + 1):
        if n % j == 0 and is_prime(j):
    return largest
```

通过为模型提供补充的上下文，它可以更有导向性。然而，这对模型来说是一项更有约束和挑战性的任务。

> **译者注：**
>
> 核心是通过添加 `suffix` 作为补充后半段的提示文本，让模型知道要进行的是插入而非追加补全。这里我写了个请求体的示例：

```Javascript
// JavaScript
{
    "prompt": "function getDate() {let date = ",
    "model": "code-davinci-002",
    "max_tokens": 1000,
    "suffix": " }"
}
```

### 最佳实践

代码插入是测试版的一个新特性，为了获得更好的结果，你可能需要修改使用 API 的方式。这里有一些最佳实践：

**使 `max_tokens` > 256**。模型在插入更长的补全时表现更好。如果 `max_tokens` 太小，模型可能会在连接到后缀之前被切断。有一点要提的是，即便你设置了更大的 `max_tokens` ，你也只需为实际生成的 token 付费。

**建议设置 `finish_reason` == "stop"**。当模型到达一个自然结束的点或者是一个用户提供的停止符，它将会设置 `finish_reason` 为 "stop"。这表面模型已经成功地连接到后缀，并且对补全的质量来说是一个好的信号。这与使用 n > 1 或重新采样 ( resampling ) 时在几个补全之间进行选择特别相关(参见下一点)。

**重采样 3 到 5 次**。虽然几乎所有的补全都连接到前缀，但在某些困难的情况下，模型可能难以连接到后缀。我们发现重采样 3 到 5 次 ( 或是使 `best_of` 的值在 3 到 5 间 ) (译者注：前面括号这里不是很确定翻译的对不对，原文是 `"or using best_of with k=3,5"`) 并且挑选出那些 `finish_reason` 是 "stop" 的样本可以有效地避免这种情况。当你在使用重采用时，你通常可以用更高的 `temperatures` 来提高结果的多样性。

说明：如果全部的返回结果的 `finish_reason` 都是 "stop"，那它可能是因为 `max_tokens` 设置的太小了，并且通常都是模型在尝试连接前后缀的时候，就已经超出 token 的数量限制了，这种情况可以考虑提高一下 `max_tokens`。

## **<a id="EditCode">编辑代码 ( 测试版 )</a>**

[编辑](<../API参考/编辑(Edits).md>)接口可以用来帮忙编辑代码，而不仅仅是补全它。你提供一段代码并说明如何修改它， `code-davinci-edit-001` 模型就会相应地尝试去编辑它。这是重构和调整代码的自然接口。在这个初始的测试期间，编辑接口可以免费试用。

### **例子**

#### **迭代构建一个程序**

写代码通常是一个迭代的过程并且需要不断地改进代码。编辑可以自然地持续优化模型输出的代码，直到最终得到一个优雅的结果。在这个例子中，我们使用斐波纳契数列来展示如何迭代构建代码。

**1. 编写一个函数**
![编写一个函数](</image/指引-代码补全-01.png>)

**2. 重构它**
![重构它](</image/指引-代码补全-02.png>)
```python
# 输入的代码
    if num ==1:
        print(a)
    else:
        print(a)
        print(b)
        #the sequence starts with 0,1
        for i in range(2,num):
            c = a+b
            a = b
            b = c
            print(c)

fibonacci(10)
```

**3. 函数重命名**
![函数重命名](</image/指引-代码补全-03.png>)
```python
# 输入的代码
def fibonacci(num):
    if num <= 1:
        return num
    else:
        return fib(num-1) + fib(num-2)
print(fibonacci(10))
```

**4. 添加说明文档**
![添加说明文档](</image/指引-代码补全-04.png>)
```python
# 输入的代码
def fib(num):
    if num <= 1:
        return num
    else:
        return fib(num-1) + fib(num-2)
print(fib(10))
```

### **最佳实践**
编辑功能仍处于 alpha 阶段，我们有下面这几条最佳实践：
1. 考虑使用空的 `prompt` 入参！在这个例子中，编辑可以简单地用来补全。
2. 命令 ( 说明 ) 越具体越好。
3. 有时候，模型不能找到解决方案并且会导致错误，我们建议你修改一下命令或者输入值。