import type { IngredientGroup } from '@/types'

// Map ingredient names to groups
const meatKeywords = [
  '猪', '牛', '羊', '鸡', '鸭', '鹅', '兔', '五花肉', '排骨', '里脊', '腩', '蹄', '翅', '腿',
  '火腿', '猪血', '皮冻', '肉末', '肉丝', '瘦肉', '带鱼', '猪蹄',
]
const veggieKeywords = [
  '白菜', '菠菜', '韭菜', '芹菜', '菜心', '生菜', '油菜', '青菜', '空心菜', '茼蒿', '莴笋',
  '土豆', '番茄', '西红柿', '茄子', '黄瓜', '青椒', '红椒', '辣椒', '胡萝卜', '萝卜',
  '洋葱', '西兰花', '花椰菜', '藕', '莲藕', '冬瓜', '南瓜', '丝瓜', '苦瓜', '玉米',
  '四季豆', '豆角', '豆芽', '绿豆芽', '黄豆芽', '豆苗', '蒜苗', '木耳', '香菇', '蘑菇',
  '金针菇', '平菇', '山药', '蒜苗', '葱', '姜', '蒜', '韭黄', '芦笋', '秋葵', '海带',
  '紫菜', '莴苣', '莲藕', '竹笋', '枸杞',
]
const seafoodKeywords = [
  '鱼', '虾', '蟹', '贝', '蛤', '蚌', '蚝', '鱿鱼', '墨鱼', '章鱼', '螺', '海鲜',
  '鲈鱼', '草鱼', '带鱼', '鲫鱼', '鲢鱼', '鳕鱼', '三文鱼', '鲍鱼', '扇贝',
  '虾仁', '虾皮', '基围虾', '鱼头', '鱼片', '鱼豆腐',
]
const tofuKeywords = [
  '豆腐', '豆干', '腐竹', '豆皮', '豆泡', '内酯豆腐', '老豆腐', '豆腐皮', '豆腐干', '豆浆',
  '千张', '素鸡',
]
const dairyKeywords = [
  '鸡蛋', '鸭蛋', '鹌鹑蛋', '皮蛋', '咸蛋', '牛奶', '奶油', '黄油', '芝士', '奶酪',
]

export function getIngredientGroup(name: string): IngredientGroup {
  if (seafoodKeywords.some(k => name.includes(k))) return '海鲜水产'
  if (dairyKeywords.some(k => name.includes(k))) return '蛋奶'
  if (tofuKeywords.some(k => name.includes(k))) return '豆制品'
  if (meatKeywords.some(k => name.includes(k))) return '肉类'
  if (veggieKeywords.some(k => name.includes(k))) return '蔬菜'
  return '其他'
}

export const GROUP_ORDER: IngredientGroup[] = [
  '肉类',
  '蔬菜',
  '海鲜水产',
  '豆制品',
  '蛋奶',
  '其他',
]
