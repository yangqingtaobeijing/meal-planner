// Unsplash food images mapped to recipe IDs
// Using specific photo IDs for relevant Chinese dishes
export const builtinRecipeImages: Record<string, string> = {
  // 荤菜
  r001: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop', // 宫保鸡丁 - chicken stir fry
  r002: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&h=300&fit=crop', // 红烧肉 - braised pork
  r003: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop', // 麻婆豆腐 - tofu dish
  r004: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop', // 回锅肉 - pork stir fry
  r005: 'https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?w=400&h=300&fit=crop', // 水煮鱼 - fish
  r006: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop', // 红烧排骨 - ribs
  r007: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop', // 可乐鸡翅 - chicken wings
  r008: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop', // 糖醋里脊 - sweet sour pork
  r009: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop', // 清蒸鲈鱼 - steamed fish
  r010: 'https://images.unsplash.com/photo-1551183053-bf91798d454f?w=400&h=300&fit=crop', // 土豆炖牛肉 - beef stew
  r011: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop', // 京酱肉丝 - pork shreds
  r012: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop', // 鱼香肉丝 - pork
  r013: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c7?w=400&h=300&fit=crop', // 红烧鸡腿 - chicken leg
  r014: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', // 番茄牛腩 - tomato beef
  // 素菜
  r015: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', // 西红柿炒鸡蛋 - tomato egg
  r016: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', // 地三鲜 - vegetables
  r017: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=400&h=300&fit=crop', // 蒜蓉炒菠菜 - spinach
  r018: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop', // 干煸四季豆 - green beans
  r019: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', // 清炒豆芽 - bean sprouts
  r020: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400&h=300&fit=crop', // 凉拌黄瓜 - cucumber
  r021: 'https://images.unsplash.com/photo-1594916069718-85e32fd8e9e6?w=400&h=300&fit=crop', // 炒白菜 - cabbage
  r022: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400&h=300&fit=crop', // 拍黄瓜 - cucumber
  r023: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop', // 蒜蓉西兰花 - broccoli
  r024: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop', // 土豆丝 - potato
  r025: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', // 清炒藕片 - lotus root
  // 汤羹
  r026: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop', // 番茄蛋花汤 - soup
  r027: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop', // 紫菜蛋花汤 - soup
  r028: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', // 酸辣汤 - hot sour soup
  r029: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop', // 冬瓜排骨汤 - soup
  r030: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop', // 玉米排骨汤 - corn soup
  r031: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop', // 豆腐鱼头汤 - fish soup
  r032: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop', // 莲藕花生猪蹄汤
  r033: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop', // 菠菜猪血汤
  r034: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop', // 山药排骨汤
  r035: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop', // 海带豆腐汤
  // 主食
  r036: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop', // 扬州炒饭 - fried rice
  r037: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', // 葱油面 - noodles
  r038: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', // 番茄鸡蛋面 - noodles
  r039: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop', // 饺子 - dumplings
  r040: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop', // 蛋炒饭 - fried rice
  r041: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop', // 韭菜盒子 - pastry
  r042: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', // 肉末茄子拌面 - noodles
  r043: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop', // 皮蛋瘦肉粥 - congee
  r044: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop', // 炸酱面 - noodles
  r045: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop', // 小笼包 - dumplings
  // 其他
  r046: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop', // 蒜泥白肉
  r047: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=300&fit=crop', // 青椒炒牛肉
  r048: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400&h=300&fit=crop', // 虾仁炒鸡蛋
  r049: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop', // 红烧带鱼 - fish
  r050: 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=400&h=300&fit=crop', // 蚝油生菜 - vegetables
}
