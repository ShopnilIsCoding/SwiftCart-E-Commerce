## 1) null এবং undefined এর পার্থক্য
undefined হয় যখন variable declare করা আছে কিন্তু কোনো value দেওয়া হয়নি।  
null আমরা নিজেরা দেই যখন ইচ্ছা করে variable empty রাখতে চাই।  
মানে undefined = value নাই এখনো, null = ইচ্ছা করে খালি রাখা।

## 2) map() এর কাজ এবং forEach() থেকে পার্থক্য
map() array এর প্রতিটি element নিয়ে কাজ করে নতুন একটা array বানায়।  
forEach() শুধু loop চালায়, নতুন array return করে না।  

## 3) == এবং === এর পার্থক্য
== value compare করে এবং দরকার হলে type change করে।  
=== value এবং type দুইটাই check করে। 

## 4) API fetch এ async/await কেন দরকার
API থেকে data আসতে সময় লাগে। async/await ব্যবহার করলে code সহজভাবে লেখা যায় এবং data আসা পর্যন্ত অপেক্ষা করে তারপর পরের কাজ করে। এতে code বুঝতে সহজ হয়।

## 5) JavaScript Scope (Global, Function, Block)
Scope মানে variable কোথায় ব্যবহার করা যাবে।

Global scope: সব জায়গা থেকে ব্যবহার করা যায়।  
Function scope: শুধু function এর ভিতরে কাজ করে।  
Block scope: {} এর ভিতরে declare করলে শুধু ওই block এর ভিতরেই থাকে।
