import {mutation,query} from "./_generated/server";
import {v} from "convex/values";
export const createLink=mutation({
  args:{
    title:v.string(),
    url:v.string(),
    note:v.string(),
  },
  handler:async(ctx,args)=>{
    const identity=await ctx.auth.getUserIdentity();
    if(!identity){
      throw new Error("Unauthorized");
    }
    const linkId=await ctx.db.insert("links",{
      userId:identity.subject,
      title:args.title,
      url:args.url,
      note:args.note,
      createdAt:Date.now(),
    });
    return linkId;
  }
});
//Get all links for a user
export const getAllLinks=query({
  handler:async(ctx)=>{
    const identity=await ctx.auth.getUserIdentity();
    if(!identity){
      return [];
    }
    const allLinks=await ctx.db.query("links").withIndex("by_user",q=>q.eq('userId',identity.subject)).order("asc").collect();
    return allLinks;
  }
})
//search link
export const searchLinks=query({
  args:{
    searchTerm:v.string()
  },
  handler:async(ctx,args)=>{
    const identity=await ctx.auth.getUserIdentity();
    if(!identity){
      return [];
    }
    const allLinks=await ctx.db.query("links").withIndex("by_user",q=>q.eq('userId',identity.subject)).order("asc").collect();
    const searchTermLower=args.searchTerm.toLowerCase();
    const filteredLinks=allLinks.filter(link =>link.title.toLowerCase().includes(searchTermLower) || link.url.toLowerCase().includes(searchTermLower) || link.note.toLowerCase().includes(searchTermLower));
    return filteredLinks;
  }
})
//delete link
export const deleteLink=mutation({
  args:{
    linkId:v.id("links")
  },
  handler:async(ctx,args)=>{
    const identity=await ctx.auth.getUserIdentity();
    if(!identity){
      throw new Error("Unauthorized");
    }
    const link=await ctx.db.get(args.linkId);
    if(!link || link.userId !== identity.subject){
      throw new Error("Not found");
    }
    return await ctx.db.delete(args.linkId);
   
  }
})
//update link
export const updateLink=mutation({
  args:{
    linkId:v.id("links"),
    title:v.string(),
    url:v.string(),
    note:v.string(),
  },
  handler:async(ctx,args)=>{
    const identity=await ctx.auth.getUserIdentity();
    if(!identity){
      throw new Error("Unauthorized");
    }
    const link=await ctx.db.get(args.linkId);
    if(!link || link.userId !== identity.subject){
      throw new Error("Not found");
    }
    return await ctx.db.patch(args.linkId,{
      title:args.title,
      url:args.url,
      note:args.note,
    });
  }
});
//get link by id
export const getLinkById=query({
  args:{
    linkId:v.id("links")
  },
  handler:async(ctx,args)=>{
    const identity=await ctx.auth.getUserIdentity();
    if(!identity){
      throw new Error("Unauthorized");
    }
    const link=await ctx.db.get(args.linkId);
    if(!link || link.userId !== identity.subject){
      throw new Error("Not found");
    }
    return link;
  }
});
//createLink,getAllLinks,searchLinks,deleteLink,updateLink,getLinkById