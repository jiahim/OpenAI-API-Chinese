## 前置条件
1. 这里默认已经科学上网并已处理了被地区封禁的问题
2. 账号已经登陆，且处于登陆后的默认页面

## 如何设置信用卡来付款
1. 点击右上角的头像，选择“Manage account”![](https://img-blog.csdnimg.cn/f19d4c2a80f04e749f11b43fce5b1f27.png)
2. 点击箭头所指的“Billing”

![](https://img-blog.csdnimg.cn/8393082c08ed46eeb16fce0092eb9a21.png)

4. 点击“Set up paid account”

![](https://img-blog.csdnimg.cn/7453a49114a34f9cb1cc046874abf5e6.png)

5. 此时会跳出弹窗，根据情况选择“个人”或“公司”，公司和个人的填写内容基本一样，唯一的不同是，公司需要填写多一个公司税号。如下图，左边为设置个人付款方式的不同，右边为公司付款方式的不同。

![](https://img-blog.csdnimg.cn/65fcc7d601854d89bc05c73c318f9648.png)
> **说明：公司税号 Business tax ID**
> 截止到2023-2-26，**暂不支持中国大陆的税号**，支持的国家和地区如下：
> 澳大利亚、奥地利、比利时、巴西、保加利亚、加拿大、克罗地亚、塞浦路斯、捷克共和国、丹麦、爱沙尼亚、芬兰、法国、格鲁吉亚、德国、希腊、匈牙利、冰岛、印度、印度尼西亚、爱尔兰、以色列、意大利、日本、拉脱维亚、列支敦士登、立陶宛、卢森堡、马来西亚、马耳他、墨西哥、荷兰、新西兰、挪威、波兰、葡萄牙、罗马尼亚、沙特阿拉伯、新加坡、斯洛伐克、斯洛文尼亚、西班牙、瑞典、瑞士、台湾、泰国、阿拉伯联合酋长国、英国
6. 这里我们选择“个人”

![](https://img-blog.csdnimg.cn/894c1d6ee2dd4b02b92d59d219742aad.png)

8. 填写信息，注意的是，如果选择的国家不在前面的列表的话，是不支持提供服务的，如果填写的地区为中国大陆或香港地区，会出现无法提交的情况，所以这里选择台湾省。

![](https://img-blog.csdnimg.cn/bdf6be11f05f4a62bd53f8861dabcec8.png)
![](https://img-blog.csdnimg.cn/cbb76642afa94017a1dc6790943f4ed0.png)
9. 最后的地址信息如下，使用的是台湾大学男生宿舍的地址（台湾台北市大安區長興街50號，邮编10672）：
![](https://img-blog.csdnimg.cn/69631c1d5e5840488296864154e2b299.png)
 
 10. 最后使用非中国大陆或香港的卡，才可以付款。
>⚠️注意
> - 国内的万事达和VISA卡是无法成功的（见下图），不论是哪家银行的都不行
> - 自己如果拥有境外卡是最好的
> - 如果是个人使用且没有境外的信用卡，可以考虑使用[Depay](https://depay.depay.one/web-app/register-h5?invitCode=635324&lang=zh-cn)。用身份证认证即可开卡，可以选择免费卡或者是支付一定开卡费享受一些权益，看个人情况选择。
 
 ![](https://img-blog.csdnimg.cn/86ba5be630e84e8aa498898243668fc7.png)

11. 提交成功后，会显示成功，邮箱也会收到提示邮件

![](https://img-blog.csdnimg.cn/3fdf8af459a64b5da0d821f91b28d955.png)
![](https://img-blog.csdnimg.cn/a1aeb3718b724bfd8d5a662d1a6a7139.png)


## 写在最后，关于费用的问题
- OpenAI接口的付费是后付费，每月末为当月全部用量付款
- 如果担心费用超预算，可以通过**硬限制**强制限制当月消费额，达到即停止；也可以选择**软限制**当月消费达到预定额度即发邮件提醒
- 可以通过[https://beta.openai.com/account/usage](https://beta.openai.com/account/usage)查看每月token的消耗量
- 可以在这里[https://beta.openai.com/tokenizer](https://beta.openai.com/tokenizer)去模拟看看自己输入的字符所需的token数。引自官方的说法，对于英语文本，1个标记大约是4个字符或0.75个单词，作为参考，莎士比亚的作品集约有90万字或120万个符号。对于中文文本官方没有提供说明，但根据我的经验，大约6个汉字需要10个token，下图仅供参考，6个汉字11token，4个英文单词4个token，可以在前面的连接自行测试下。![](https://img-blog.csdnimg.cn/d2016ea44b0b4dee8cb2042cafd8a2d7.png)
-  如果你有更多想了解的信息，也可以自行到[官网F&Q](https://openai.com/api/pricing/#faq-completions-pricing)进行查看，这里只做部份翻译。